import React from 'react';
import { Shield, Clock, Star, Award, Users, ThumbsUp } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About UrbanServices</h1>
            <p className="text-xl max-w-3xl mx-auto text-blue-100">
              We're on a mission to transform how people access home services by connecting customers with skilled professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2020, UrbanServices started with a simple idea: make home services accessible, affordable, and reliable for everyone.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We noticed that finding trusted professionals for home services was often a challenge. People relied on word-of-mouth recommendations or took chances with unknown service providers.
              </p>
              <p className="text-lg text-gray-600">
                Our platform bridges this gap by connecting customers with verified professionals across various service categories. We've grown from a small startup to serving thousands of customers across major cities.
              </p>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Team Meeting" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trust & Safety</h3>
              <p className="text-gray-600">
                We prioritize your safety by thoroughly vetting all service professionals and implementing secure payment systems.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Award className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Service</h3>
              <p className="text-gray-600">
                We're committed to excellence in every service we offer, ensuring you receive the highest quality work.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ThumbsUp className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer Satisfaction</h3>
              <p className="text-gray-600">
                Your happiness is our priority. We work tirelessly to ensure every service exceeds your expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Leadership Team</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the people driving our mission forward
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="CEO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Rajiv Mehta</h3>
              <p className="text-blue-600">CEO & Co-founder</p>
              <p className="mt-2 text-gray-600">
                With 15+ years in tech and service industries, Rajiv leads our strategic vision.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="COO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Priya Singh</h3>
              <p className="text-blue-600">COO & Co-founder</p>
              <p className="mt-2 text-gray-600">
                Priya oversees our operations, ensuring seamless service delivery across all cities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="CTO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Vikram Sharma</h3>
              <p className="text-blue-600">CTO</p>
              <p className="mt-2 text-gray-600">
                Vikram leads our tech team, building innovative solutions to enhance user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Impact</h2>
            <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
              Numbers that reflect our journey and growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">50K+</p>
              <p className="text-xl text-blue-100">Happy Customers</p>
            </div>
            
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">10K+</p>
              <p className="text-xl text-blue-100">Service Providers</p>
            </div>
            
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">20+</p>
              <p className="text-xl text-blue-100">Cities Covered</p>
            </div>
            
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">100K+</p>
              <p className="text-xl text-blue-100">Services Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Journey</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Whether you're looking for quality home services or are a professional wanting to grow your business, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/services" 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Explore Services
            </a>
            <a 
              href="/contact" 
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;