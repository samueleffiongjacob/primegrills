import { useState } from "react";
import BankTransferPayment from "../components/BankTransfer";
import CardPaymentForm from "../components/CardPayment";
import { CreditCard, Building2, ArrowLeft, Check } from "lucide-react";

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "card">("card");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [amount] = useState("$249.99");

  const handleBackToPayment = () => {
    setPaymentSuccess(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl max-w-md w-full overflow-hidden">
        {/* Header section */}
        <div className="bg-gradient-to-r from-amber-500 to-[#EE7F61] p-5 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <div className="text-right">
              <p className="text-xs opacity-80">Amount to pay</p>
              <p className="text-xl font-bold">{amount}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {paymentSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your transaction has been completed successfully.
                A confirmation email has been sent to your inbox.
              </p>
              <button 
                onClick={handleBackToPayment}
                className="flex items-center justify-center mx-auto text-[#EE7F61] hover:text-amber-600 font-medium transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to payment options
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Select Payment Method
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Choose your preferred payment method to continue
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    paymentMethod === "card"
                      ? "border-[#EE7F61] bg-amber-50 text-gray-800"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard className={`w-5 h-5 ${paymentMethod === "card" ? "text-[#EE7F61]" : "text-gray-400"}`} />
                  <span className="font-medium">Card</span>
                </button>
                <button
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    paymentMethod === "bank"
                      ? "border-[#EE7F61] bg-amber-50 text-gray-800"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                  onClick={() => setPaymentMethod("bank")}
                >
                  <Building2 className={`w-5 h-5 ${paymentMethod === "bank" ? "text-[#EE7F61]" : "text-gray-400"}`} />
                  <span className="font-medium">Bank</span>
                </button>
              </div>

              {paymentMethod === "card" ? (
                <CardPaymentForm onPaymentSuccess={() => setPaymentSuccess(true)} />
              ) : (
                <BankTransferPayment onPaymentSuccess={() => setPaymentSuccess(true)} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;