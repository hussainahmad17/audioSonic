import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import { API_BASE_URL, AUDIO_BASE_URL } from '@app/backendServices/ApiCalls';

const API_URL = API_BASE_URL;
const audio_url = AUDIO_BASE_URL;

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get('session_id');

    if (!sessionId) {
      setError("Invalid session ID");
      setLoading(false);
      return;
    }

    const confirmPayment = async () => {
      try {
        const response = await axios.get(`${API_URL}/paid-audio/confirm-payment?session_id=${sessionId}`);
        setAudio(response.data.audio);
        setLoading(false);
      } catch (err) {
        setError("Failed to confirm payment. Please contact support.");
        setLoading(false);
      }
    };

    confirmPayment();
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-2xl">Processing your payment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-2xl text-center">
          <div className="text-rose-500 mb-4">Error: {error}</div>
          <p className="text-gray-400 text-lg">Please try again or contact support.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Library
          </button>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full bg-black/50 border border-rose-400/30 rounded-xl p-8 shadow-2xl shadow-rose-500/10">
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>

          {/* Updated message */}
          <p className="text-gray-300 mb-6">
            Your premium audio has been sent to your email address.
            <br />
            <span className="text-rose-400 font-medium">
              Please check your inbox and spam folder.
            </span>
          </p>

          {audio && (
            <div className="w-full mb-6 p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-rose-500/20 p-2 rounded-lg">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold">{audio.title}</h2>
                  <p className="text-gray-400 text-sm">{audio.description.substring(0, 50)}...</p>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <div>${audio.priceAmount.toFixed(2)}</div>
                <div>{formatDuration(audio.duration)}</div>
              </div>
            </div>
          )}

          {/* Removed download button */}
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg font-medium hover:from-rose-600 hover:to-pink-600 transition-colors"
          >
            Browse More Audios
          </button>
        </div>
      </div>
    </div>
  );
}