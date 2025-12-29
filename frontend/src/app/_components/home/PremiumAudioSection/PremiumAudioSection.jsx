import React, { useState } from "react";
import { Sparkles, ArrowRight, Crown, X } from "lucide-react";
import { postRequest } from "@app/backendServices/ApiCalls";

const PremiumAudioSection = () => {
  const [audioRequest, setAudioRequest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
 
  const handlePayment = async () => {
    setIsSubmitting(true);

    const base_url = "/custom-audio"; // no need to repeat full URL, since postRequest already adds API_BASE_URL

    try {
      // Store data in localStorage for success page access
      localStorage.setItem("audioRequest", audioRequest);
      localStorage.setItem("customerEmail", email);

      // Create checkout session with postRequest
      postRequest(
        `${base_url}/create-checkout-session`,
        {
          audioRequest,
          email,
          amount: 4999, // in cents
          productName: "Premium Custom Audio",
        },
        (response) => {
          const session = response.data; // axios puts response body in .data
          console.log("Checkout session response:", session);

          // Redirect to Stripe Checkout
          if (session?.url) {
            window.location.href = session.url;
          } else {
            throw new Error("No checkout URL returned");
          }
        },
        (error) => {
          console.error("Payment error:", error);
          alert("Payment processing failed. Please try again.");
          setIsSubmitting(false);
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Payment processing failed. Please try again.");
      setIsSubmitting(false);
    }
  };



  return (
    <section id="premium" className="py-20 px-6 bg-transparent text-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="w-8 h-8 text-rose-400" />
            <h2 className="text-4xl md:text-5xl font-light font-cormorant text-white">
              Custom <span className="text-rose-400">Audios</span>
            </h2>
            <Crown className="w-8 h-8 text-rose-400" />
          </div>

          <p className="text-xl text-gray-300 font-sans max-w-3xl mx-auto mb-6">
            Unlock the full experience — deeper intimacy, richer voices, and
            audios crafted just for you.
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <Sparkles className="w-5 h-5 text-rose-400" />
            <p className="text-lg text-rose-200 font-sans">
              Describe your perfect audio. We'll craft it for you and deliver
              within 24 hours — just for you.
            </p>
            <Sparkles className="w-5 h-5 text-rose-400" />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-rose-400/30 shadow-md rounded-xl p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-300 mb-3 font-sans">
                Describe Your Perfect Audio Experience
              </label>
              <textarea
                value={audioRequest}
                onChange={(e) => setAudioRequest(e.target.value)}
                placeholder="Tell us about your ideal audio scenario... What voice style do you prefer? What setting or story would you like? Any specific details that would make this perfect for you?"
                className="w-full h-32 px-4 py-3 bg-black/40 border border-rose-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 resize-none font-sans"
                rows={4}
                maxLength={500}
              />
              <div className="text-right mt-2">
                <span className="text-sm text-gray-400">
                  {audioRequest.length}/500 characters
                </span>
              </div>
            </div>
            <label className="block text-xl font-medium text-rose-400 mb-3 font-sans">
              3 custom slots left for 24h delivery today
            </label>
            <div className="grid md:grid-cols-2 gap-4 py-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-rose-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="text-white font-semibold font-sans">
                    Personalized Content
                  </h4>
                  <p className="text-gray-300 text-sm font-sans">
                    Crafted specifically for your preferences
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-rose-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="text-white font-semibold font-sans">
                    24-Hour Delivery
                  </h4>
                  <p className="text-gray-300 text-sm font-sans">
                    Fast turnaround, just for you
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-rose-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="text-white font-semibold font-sans">
                    Premium Quality
                  </h4>
                  <p className="text-gray-300 text-sm font-sans">
                    High-quality audio production
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-rose-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="text-white font-semibold font-sans">
                    Exclusive Access
                  </h4>
                  <p className="text-gray-300 text-sm font-sans">
                    Your audio, nobody else's
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-400/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold font-sans">
                    Premium Custom Audio
                  </h4>
                  <p className="text-gray-300 text-sm font-sans">
                    One-time payment, lifetime access
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-rose-400">
                    $49.99
                  </span>
                  <p className="text-gray-300 text-sm font-sans">per audio</p>
                </div>
              </div>
            </div>

            {!showEmailInput ? (
              <button
                onClick={() => setShowEmailInput(true)}
                disabled={!audioRequest.trim()}
                className={`w-full flex items-center justify-center gap-3 font-sans text-white font-bold px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${!audioRequest.trim()
                  ? "bg-[#562D37] cursor-not-allowed"
                  : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 hover:scale-105"
                  }`}
              >
                <Crown className="w-5 h-5" />
                {!audioRequest.trim()
                  ? "Description is Required"
                  : "Create My Premium Audio"}
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-black/40 border border-rose-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 font-sans"
                  />
                  <button
                    onClick={() => {
                      setShowEmailInput(false);
                      setEmail("");
                      setConsentChecked(false);
                    }}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-300 font-sans">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={() => setConsentChecked(!consentChecked)}
                    className="mt-1 accent-rose-500"
                  />
                  <p>
                    I agree to share my email to receive my custom audio request
                    and updates.
                  </p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={
                    isSubmitting ||
                    !audioRequest.trim() ||
                    !email.trim() ||
                    !consentChecked
                  }
                  className={`w-full flex items-center justify-center gap-3 font-sans text-white font-bold px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${isSubmitting ||
                    !audioRequest.trim() ||
                    !email.trim() ||
                    !consentChecked
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 hover:scale-105"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5" />
                      Continue to Payment
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="text-center pt-4 border-t border-rose-400/30">
              <p className="text-sm text-gray-400 font-sans">
                🛡️{" "}
                <span className="text-rose-400">
                  100% Satisfaction Guarantee
                </span>{" "}
                - If you're not completely satisfied, we'll make it right or
                refund your money.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumAudioSection;