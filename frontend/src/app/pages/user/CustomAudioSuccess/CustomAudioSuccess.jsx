import React, { useEffect, useState } from 'react';
import { CheckCircle, X, Loader } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { postRequest } from '@app/backendServices/ApiCalls';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [confirmationError, setConfirmationError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [audioRequest, setAudioRequest] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    // Get data from localStorage first
    const storedAudioRequest = localStorage.getItem("audioRequest");
    const storedCustomerEmail = localStorage.getItem("customerEmail");
    
    setAudioRequest(storedAudioRequest || '');
    setCustomerEmail(storedCustomerEmail || '');

    const confirmPayment = async () => {
      const sessionId = searchParams.get("session_id");

      console.log("Session ID from URL:", sessionId);
      console.log("Audio request from storage:", storedAudioRequest);
      console.log("Customer email from storage:", storedCustomerEmail);

      if (!sessionId) {
        setIsConfirming(false);
        setConfirmationError(true);
        setErrorMessage("No session ID found in URL");
        return;
      }

      if (!storedAudioRequest || !storedCustomerEmail) {
        setIsConfirming(false);
        setConfirmationError(true);
        setErrorMessage("Missing audio request or customer email. Please go back and submit your request again.");
        return;
      }

      try {
        postRequest(
          "/custom-audio/confirm-payment",
          {
            sessionId,
            audioRequest: storedAudioRequest,
            customerEmail: storedCustomerEmail,
          },
          (response) => {
            const result = response.data;
            setIsConfirming(false);

            if (!result.success) {
              setConfirmationError(true);
              setErrorMessage(result.error || "Failed to confirm payment");
              console.error("Failed to confirm payment:", result.error);
            }
            
            // Only clear localStorage after successful confirmation
            localStorage.removeItem('audioRequest');
            localStorage.removeItem('customerEmail');
          },
          (error) => {
            setIsConfirming(false);
            setConfirmationError(true);
            setErrorMessage("Network error. Please try again.");
            console.error("Error confirming payment:", error);
          }
        );
      } catch (error) {
        setIsConfirming(false);
        setConfirmationError(true);
        setErrorMessage("Unexpected error. Please try again.");
        console.error("Unexpected error confirming payment:", error);
      }
    };

    confirmPayment();
  }, [searchParams]);

  if (isConfirming) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-6">
        <div className="bg-black/40 backdrop-blur-sm border border-rose-400/30 rounded-xl p-8 max-w-md w-full text-center">
          <Loader className="w-16 h-16 text-rose-400 animate-spin mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-rose-400">Processing Your Payment</h2>
          <p className="text-lg mb-6">
            Please wait while we confirm your payment and process your request.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-6">
      <div className="bg-black/40 backdrop-blur-sm border border-rose-400/30 rounded-xl p-8 max-w-md w-full text-center">
        {confirmationError ? (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-red-400">Confirmation Issue</h2>
            <p className="text-lg mb-6">
              {errorMessage || 'Failed to confirm payment. Please contact support.'}
            </p>

            <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-red-300 mb-2">Contact Support:</h3>
              <p className="text-gray-300 text-sm mb-2">Email: support@audioservice.com</p>
              <p className="text-gray-300 text-sm">
                Please include your session ID: {searchParams.get('session_id')}
              </p>
            </div>
          </>
        ) : (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-rose-400">Thank You!</h2>
            <p className="text-lg mb-6">
              Your payment was successful and your custom audio request has been received.
            </p>
            
            {audioRequest && (
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4 text-left">
                <h3 className="font-semibold mb-2 text-rose-300">Your Request:</h3>
                <p className="text-gray-300 italic">"{audioRequest}"</p>
              </div>
            )}
            
            {customerEmail && (
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4 text-left">
                <h3 className="font-semibold mb-2 text-rose-300">Delivery Email:</h3>
                <p className="text-gray-300">{customerEmail}</p>
              </div>
            )}
          </>
        )}

        <div className="bg-rose-900/20 border border-rose-400/30 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-rose-300 mb-2">What's Next:</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Our team is crafting your custom audio</li>
            <li>• You'll receive it within 24 hours</li>
            <li>• Check your email for updates</li>
            {confirmationError && (
              <li className="text-red-300">• Please contact support with your order details</li>
            )}
          </ul>
        </div>

        <p className="text-gray-300 text-sm mb-6">
          If you have any questions, contact us at support@audioservice.com
        </p>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 mb-4"
        >
          Back to Library
        </button>

        {confirmationError && (
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;