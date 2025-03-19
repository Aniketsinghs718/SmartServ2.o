import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  role: 'customer' | 'provider';
  full_name: string;
  avatar_url?: string;
  phone?: string;
  email: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isProvider: boolean;
  signUp: (email: string, password: string, role: 'customer' | 'provider', fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<{ provider: string; url: string } | undefined>;
  signOut: () => Promise<void>;
  loadProfile: () => Promise<void>;
  becomeProvider: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isProvider: false,

  signUp: async (email: string, password: string, role: 'customer' | 'provider', fullName: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // First check if the profiles table exists
        try {
          // Check if the profile already exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (existingProfile) {
            // Profile already exists, just set it
            set({ 
              user: authData.user, 
              profile: existingProfile as Profile,
              isProvider: role === 'provider',
              isLoading: false 
            });
            return;
          }
          
          // Try to create a profile
          const newProfile = {
            id: authData.user.id,
            role,
            full_name: fullName,
            email
          };
          
          const { error: profileError } = await supabase
            .from('profiles')
            .insert(newProfile);

          // If provider, also create a provider profile
          if (role === 'provider') {
            try {
              await supabase
                .from('provider_profiles')
                .insert({
                  id: authData.user.id,
                  business_name: fullName,
                  description: ''
                });
            } catch (providerError) {
              // Continue even if provider profile creation fails
              // The user can set up their provider profile later
            }
          }

          // Set profile regardless of success to ensure the user can continue
          set({ 
            user: authData.user, 
            profile: newProfile as Profile,
            isProvider: role === 'provider',
            isLoading: false 
          });
        } catch (profileError) {
          // Handle database errors by using the user metadata as profile
          const newProfile = {
            id: authData.user.id,
            role,
            full_name: fullName,
            email
          };
          
          set({ 
            user: authData.user, 
            profile: newProfile as Profile,
            isProvider: role === 'provider',
            isLoading: false 
          });
        }
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        await get().loadProfile();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error("Google sign-in error:", error);
        throw error;
      }
      
      // The OAuth flow will redirect the user, so we don't need to return anything
      return data;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, profile: null, isProvider: false });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  loadProfile: async () => {
    try {
      set({ isLoading: true });
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        set({ isLoading: false });
        return;
      }
      
      // Check if profiles table exists first
      try {
        // Get profile data
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error) {
          // Profile exists, check if user is a provider
          const { data: providerProfile } = await supabase
            .from('provider_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          set({ 
            user, 
            profile, 
            isProvider: !!providerProfile,
            isLoading: false 
          });
          return;
        }
        
        // Handle error by trying to create a profile
        const userData = user.user_metadata;
        
        // Create a new profile object from user data
        const newProfile = {
          id: user.id,
          role: userData?.role || 'customer',
          full_name: userData?.full_name || userData?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
        };
        
        // Try to create the profile, but don't repeatedly log errors if it fails
        try {
          const { data: insertedProfile, error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();
            
          if (!insertError && insertedProfile) {
            // Successfully created profile
            set({ 
              user, 
              profile: insertedProfile, 
              isProvider: newProfile.role === 'provider',
              isLoading: false 
            });
            return;
          }
          
          // If insert failed but we have profile data, use it anyway
          set({ 
            user, 
            profile: newProfile as Profile, 
            isProvider: newProfile.role === 'provider',
            isLoading: false 
          });
        } catch (createError) {
          // If profile creation failed, still keep the user logged in with basic profile
          set({ 
            user, 
            profile: newProfile as Profile, 
            isProvider: newProfile.role === 'provider',
            isLoading: false 
          });
        }
      } catch (dbError) {
        // Database error (table might not exist)
        // Still keep the user logged in with user metadata as profile
        const userData = user.user_metadata;
        const newProfile = {
          id: user.id,
          role: userData?.role || 'customer',
          full_name: userData?.full_name || userData?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
        };
        
        set({ 
          user, 
          profile: newProfile as Profile, 
          isProvider: false,
          isLoading: false 
        });
      }
    } catch (error) {
      // Only log critical errors that prevent authentication from working
      console.error('Critical error in authentication:', error);
      set({ isLoading: false });
    }
  },

  becomeProvider: async () => {
    try {
      const { user, profile } = get();
      
      if (!user || !profile) throw new Error('Must be logged in to become a provider');
      
      // Update the role in profiles
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'provider' })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile role:', updateError);
        
        // If RLS error, we'll just update the local state for now
        if (updateError.message.includes('row-level security')) {
          // Just update the local state
          set({ 
            profile: { ...profile, role: 'provider' },
            isProvider: true 
          });
        } else {
          throw updateError;
        }
      }

      // Check if provider profile already exists
      const { data: existingProviderProfile } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (!existingProviderProfile) {
        // Create provider profile entry
        const { error: providerError } = await supabase
          .from('provider_profiles')
          .insert({
            id: user.id,
          });

        if (providerError) {
          console.error('Error creating provider profile:', providerError);
          
          // If RLS error, we'll just update the local state for now
          if (!providerError.message.includes('row-level security')) {
            throw providerError;
          }
        }
      }

      // Update the local state
      set({ 
        profile: { ...profile, role: 'provider' },
        isProvider: true 
      });
    } catch (error) {
      console.error('Error becoming provider:', error);
      throw error;
    }
  }
}));

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event);
  useAuthStore.setState({ isLoading: true });
  
  if (session?.user) {
    useAuthStore.getState().loadProfile();
  } else {
    useAuthStore.setState({ user: null, profile: null, isProvider: false, isLoading: false });
  }
});

// Initialize the auth state on app load
(async () => {
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      useAuthStore.getState().loadProfile();
    } else {
      useAuthStore.setState({ isLoading: false });
    }
  } catch (error) {
    console.error('Error initializing auth state:', error);
    useAuthStore.setState({ isLoading: false });
  }
})();