
import React, { useState } from 'react';
import type { RecruiterContact } from '../types';

interface ContactFormProps {
  candidateId: string;
  candidateName: string;
  onSuccess: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ candidateId, candidateName, onSuccess }) => {
  const [formData, setFormData] = useState<Omit<RecruiterContact, 'candidateId'>>({
    recruiterName: '',
    company: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recruiterName || !formData.company || !formData.email || !formData.message) {
      setError('All fields are required.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', { ...formData, candidateId });
      setIsSubmitting(false);
      onSuccess();
    }, 1000);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">Contact Candidate</h3>
      <p className="text-slate-600 mb-6">Submit this form to reveal the candidate's name and send them your message.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="recruiterName" className="block text-sm font-medium text-slate-700">Your Name</label>
            <input type="text" name="recruiterName" id="recruiterName" value={formData.recruiterName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-slate-700">Company</label>
            <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">Your Email</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
          <textarea name="message" id="message" rows={4} value={formData.message} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"></textarea>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 transition-colors">
            {isSubmitting ? 'Sending...' : 'Submit & Reveal Name'}
          </button>
        </div>
      </form>
    </div>
  );
};
