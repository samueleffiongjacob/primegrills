


const ComplaintPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Policy for Reporting Complaints</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <p className="text-gray-700 mb-4">
          <strong>Please read and agree to proceed:</strong> 
        </p>
        <p className="text-gray-700 mb-6">
          Dear user, to better assist you with any issues or concerns, please ensure the following steps are
          followed when reporting a complaint. This allows us to address your concerns promptly and
          effectively. By proceeding, you agree to the terms outlined below.
        </p>
        <ol className="list-decimal list-inside text-gray-700 space-y-4">
          <li>
            <strong>Be Specific:</strong> 
            Clearly describe the issue you encountered, including relevant details such as date, time, and
            transaction ID if applicable.
          </li>
          <li>
            <strong>Provide Evidence:</strong> 
            Attach any supporting documents or photos (if applicable) to help us investigate the matter.
          </li>
          <li>
            <strong>Response Time:</strong> 
            We strive to respond to all complaints within 48 hours. Complex issues may take longer to resolve,
            but we will keep you updated throughout the process.
          </li>
          <li>
            <strong>Respectful Communication:</strong> 
            Our team is here to help. Please communicate respectfully and avoid offensive language.
          </li>
          <li>
            <strong>Limitations:</strong> 
            Complaints must be reported within 7 days of the incident. Older complaints may not be eligible for
            resolution.
          </li>
          <li>
            <strong>Agreement:</strong> 
            By submitting your complaint, you confirm that all information provided is accurate and truthful to
            the best of your knowledge.
          </li>
        </ol>
        <p className="text-gray-700 mt-6">
          For more information or inquiries, please contact us at 
          <a href="mailto:support@primegrills.com" className="text-[#EE7F61] underline ml-1">support@primegrills.com</a>.
        </p>
      </div>
    </div>
  );
};

export default ComplaintPolicy;
