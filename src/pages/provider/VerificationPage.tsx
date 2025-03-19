import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DocumentUpload {
  type: 'identity' | 'certification' | 'experience';
  file: File | null;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  message?: string;
}

const VerificationPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Record<string, DocumentUpload>>({
    identity: { type: 'identity', file: null, status: 'pending' },
    certification: { type: 'certification', file: null, status: 'pending' },
    experience: { type: 'experience', file: null, status: 'pending' }
  });

  const handleFileChange = (type: keyof typeof documents) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [type]: { ...prev[type], file, status: 'uploaded' }
      }));
    }
  };

  const getStatusColor = (status: DocumentUpload['status']) => {
    switch (status) {
      case 'verified':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'uploaded':
        return 'text-blue-600';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Document Verification</h1>
        <p className="mt-2 text-gray-600">
          Upload your documents to complete the verification process
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">
                Document Upload Requirements
              </h2>
              <p className="text-sm text-gray-500">
                Please ensure all documents are clear and valid
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Identity Proof */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Identity Proof</h3>
                <p className="text-sm text-gray-500">
                  Upload your Aadhaar Card or PAN Card
                </p>
              </div>
              <CheckCircle 
                className={`h-6 w-6 ${getStatusColor(documents.identity.status)}`} 
              />
            </div>
            
            <div className="mt-4">
              <label className="block">
                <span className="sr-only">Choose file</span>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  onChange={handleFileChange('identity')}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
            </div>
          </div>

          {/* Professional Certification */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Professional Certification</h3>
                <p className="text-sm text-gray-500">
                  Upload relevant certifications or training documents
                </p>
              </div>
              <CheckCircle 
                className={`h-6 w-6 ${getStatusColor(documents.certification.status)}`} 
              />
            </div>
            
            <div className="mt-4">
              <label className="block">
                <span className="sr-only">Choose file</span>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  onChange={handleFileChange('certification')}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
            </div>
          </div>

          {/* Work Experience */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
                <p className="text-sm text-gray-500">
                  Upload previous work experience letters or references
                </p>
              </div>
              <CheckCircle 
                className={`h-6 w-6 ${getStatusColor(documents.experience.status)}`} 
              />
            </div>
            
            <div className="mt-4">
              <label className="block">
                <span className="sr-only">Choose file</span>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  onChange={handleFileChange('experience')}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
            <p className="text-sm text-gray-600">
              Verification usually takes 2-3 business days. We'll notify you once completed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;