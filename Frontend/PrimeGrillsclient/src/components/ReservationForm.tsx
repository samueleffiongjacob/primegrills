import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: string;
  specialRequests: string;
}

const ReservationForm: React.FC = () => {
  const [formData, setFormData] = useState<ReservationFormData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    partySize: '2',
    specialRequests: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
 

  const availableTimeSlots = ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', 
                              '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectTimeSlot = (time: string) => {
    setFormData(prev => ({ ...prev, time }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Replace with your actual API call
      // const response = await fetch('/api/reservations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) throw new Error('Failed to submit reservation');
      
      // Simulating successful API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      // Reset form after successful submission if needed
      // setFormData({...});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-auto">
        <div className="text-center">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Reservation Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            We've received your reservation request for {formData.date} at {formData.time} for {formData.partySize} guests.
            A confirmation email has been sent to {formData.email}.
          </p>
          <button 
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            onClick={() => setIsSuccess(false)}
          >
            Make Another Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg mt-12 shadow-md max-w-xl w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Reserve Your Table</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#EE7F61] focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-opacity-50 focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 focus:ring-[#EE7F61] rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 focus:ring-[#EE7F61] rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent"

            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 focus:ring-[#EE7F61] rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
              
            />
          </div>
          <div>
            <label htmlFor="partySize" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Guests
            </label>
            <select
              id="partySize"
              name="partySize"
              value={formData.partySize}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#EE7F61] focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
         
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
              ))}
              <option value="11+">11+ guests</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time
          </label>
          <div className="grid grid-cols-3 gap-2">
            {availableTimeSlots.map(slot => (
              <button
                key={slot}
                type="button"
                onClick={() => selectTimeSlot(slot)}
                className={`py-2 px-1 text-sm rounded-md transition-colors ${
                  formData.time === slot 
                    ? 'bg-[#EE7F61] text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests (Optional)
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 focus:ring-[#EE7F61] rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
            
          ></textarea>
        </div>
        
        <Link to={'/reservation-pay'}>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-[#EE7F61] hover:bg-[#e06d50] focus:ring-[#EE7F61] text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          
        >
          Proceed to payment
        </button>
        </Link>
        {/* <button
          type="submit"
          disabled={isSubmitting || !formData.date || !formData.time}
          className="w-full py-3 px-4 bg-[#EE7F61] hover:bg-[#e06d50] focus:ring-[#EE7F61] text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          
        >
          {isSubmitting ? 'Processing...' : 'Complete Reservation'}
        </button> */}
      </form>
    </div>
  );
};

export default ReservationForm;