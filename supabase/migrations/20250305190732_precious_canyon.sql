-- Begin transaction to ensure all or nothing executes
BEGIN;

-- Check if auth schema exists and create it if not
CREATE SCHEMA IF NOT EXISTS auth;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  role TEXT DEFAULT 'customer',
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create provider_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS provider_profiles (
  id UUID PRIMARY KEY,
  business_name TEXT,
  description TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_documents JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create addresses table if it doesn't exist
CREATE TABLE IF NOT EXISTS addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create services table if it doesn't exist
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  duration TEXT,
  provider_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  service_id UUID,
  provider_id UUID,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  address_id UUID,
  price NUMERIC NOT NULL,
  tip_amount NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT 'online',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add foreign key constraints separately to avoid circular references
ALTER TABLE addresses DROP CONSTRAINT IF EXISTS addresses_user_id_fkey;
ALTER TABLE services DROP CONSTRAINT IF EXISTS services_provider_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_service_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_provider_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_address_id_fkey;

-- Now add the foreign key constraints
ALTER TABLE addresses ADD CONSTRAINT addresses_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  
ALTER TABLE services ADD CONSTRAINT services_provider_id_fkey 
  FOREIGN KEY (provider_id) REFERENCES provider_profiles(id) ON DELETE CASCADE;
  
ALTER TABLE bookings ADD CONSTRAINT bookings_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  
ALTER TABLE bookings ADD CONSTRAINT bookings_service_id_fkey 
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL;
  
ALTER TABLE bookings ADD CONSTRAINT bookings_provider_id_fkey 
  FOREIGN KEY (provider_id) REFERENCES provider_profiles(id) ON DELETE SET NULL;
  
ALTER TABLE bookings ADD CONSTRAINT bookings_address_id_fkey 
  FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL;

-- Add RLS policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Add RLS policies for provider_profiles table
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view any provider profile" ON provider_profiles;
DROP POLICY IF EXISTS "Users can insert their own provider profile" ON provider_profiles;
DROP POLICY IF EXISTS "Users can update their own provider profile" ON provider_profiles;

CREATE POLICY "Users can view any provider profile"
  ON provider_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own provider profile"
  ON provider_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own provider profile"
  ON provider_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Add RLS policies for addresses table
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON addresses;

CREATE POLICY "Users can view their own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
  ON addresses FOR DELETE
  USING (auth.uid() = user_id);

-- Add RLS policies for services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Everyone can view services" ON services;
DROP POLICY IF EXISTS "Providers can insert their own services" ON services;
DROP POLICY IF EXISTS "Providers can update their own services" ON services;
DROP POLICY IF EXISTS "Providers can delete their own services" ON services;

CREATE POLICY "Everyone can view services"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Providers can insert their own services"
  ON services FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update their own services"
  ON services FOR UPDATE
  USING (auth.uid() = provider_id);

CREATE POLICY "Providers can delete their own services"
  ON services FOR DELETE
  USING (auth.uid() = provider_id);

-- Add RLS policies for bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Providers can view bookings for their services" ON bookings;
DROP POLICY IF EXISTS "Users can insert their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Providers can update bookings for their services" ON bookings;

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view bookings for their services"
  ON bookings FOR SELECT
  USING (auth.uid() = provider_id);

CREATE POLICY "Users can insert their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can update bookings for their services"
  ON bookings FOR UPDATE
  USING (auth.uid() = provider_id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_provider_profiles_updated_at ON provider_profiles;
CREATE TRIGGER set_provider_profiles_updated_at
BEFORE UPDATE ON provider_profiles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_addresses_updated_at ON addresses;
CREATE TRIGGER set_addresses_updated_at
BEFORE UPDATE ON addresses
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_services_updated_at ON services;
CREATE TRIGGER set_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_bookings_updated_at ON bookings;
CREATE TRIGGER set_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Commit transaction
COMMIT; 