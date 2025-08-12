declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOrderParams {
  amount: number; // amount in smallest currency unit (paise)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  customerId?: string;
  email?: string;
  contact?: string;
  name?: string;
}

export interface PaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

class RazorpayService {
  private razorpayKeyId: string;
  
  constructor() {
    // Replace this with your actual Razorpay Key ID
    this.razorpayKeyId = 'rzp_test_UcXAa8ZOXDVrjd'; // Your test key
    
    // Load the Razorpay script if it hasn't been loaded yet
    this.loadRazorpayScript();
  }
  
  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  }
  
  async createPaymentOrder(params: PaymentOrderParams): Promise<string> {
    try {
      // For a complete implementation, you should use a backend API to create the order
      // Since we're skipping the backend for now, we'll use Razorpay's auto-generated order approach
      
      console.log('Payment parameters:', {
        amount: params.amount,
        currency: params.currency || 'INR',
        receipt: params.receipt
      });
      
      // Using Razorpay in manual mode (without order_id)
      // This will let Razorpay handle the payment directly
      return '';
    } catch (error) {
      console.error("Error creating payment order:", error);
      throw error;
    }
  }
  
  async openCheckout(options: {
    orderId: string;
    amount: number;
    name: string;
    description: string;
    prefillData?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    callback?: (response: PaymentSuccessResponse) => void;
  }): Promise<PaymentSuccessResponse> {
    await this.loadRazorpayScript();
    
    if (!window.Razorpay) {
      throw new Error('Razorpay SDK failed to load');
    }
    
    return new Promise((resolve, reject) => {
      try {
        // Configure Razorpay options - we'll use manual mode without order_id
        const razorpayOptions = {
          key: this.razorpayKeyId,
          amount: options.amount, // in paise
          currency: 'INR',
          name: options.name,
          description: options.description,
          // We're not providing an order_id - Razorpay will operate in manual mode
          prefill: {
            name: options.prefillData?.name || '',
            email: options.prefillData?.email || '',
            contact: options.prefillData?.contact || '',
          },
          theme: {
            color: '#3B82F6', // Tailwind blue-500
          },
          handler: function(response: PaymentSuccessResponse) {
            console.log('Payment successful:', response);
            if (options.callback) {
              options.callback(response);
            }
            resolve(response);
          },
          modal: {
            ondismiss: function() {
              console.log('Checkout form closed');
              reject(new Error('Payment canceled by user'));
            }
          },
          notes: {
            address: "SmartServ Payment"
          }
        };
        
        console.log('Initializing Razorpay with options:', razorpayOptions);
        const razorpayInstance = new window.Razorpay(razorpayOptions);
        
        razorpayInstance.on('payment.failed', function(response: any) {
          console.error('Payment failed:', response.error);
          reject(new Error(`Payment failed: ${response.error.description}`));
        });
        
        razorpayInstance.open();
      } catch (error) {
        console.error('Error opening Razorpay checkout:', error);
        reject(error);
      }
    });
  }
  
  async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    try {
      // In a real implementation, this verification should happen on your server
      console.log('Payment details to verify:', {
        paymentId,
        orderId,
        signature
      });
      
      // For testing without a backend, we'll assume the payment is valid
      // In production, NEVER skip server-side verification!
      return true;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  }
}

export const razorpayService = new RazorpayService();