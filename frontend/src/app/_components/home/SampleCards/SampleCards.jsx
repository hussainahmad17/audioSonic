import React, { useEffect, useState, useRef } from "react";
import {
  Gift,
  Volume2,
  Clock,
  Play,
  Mail,
  Download,
  X,
  Star,
  ArrowDownToLine,
} from "lucide-react";
import {
  API_BASE_URL,
  AUDIO_BASE_URL,
  getRequest,
  postRequest,
} from "@app/backendServices/ApiCalls";
import clsx from "clsx";
import { useInView } from "react-intersection-observer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SampleCards = () => {
  // State management
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [sendingId, setSendingId] = useState(null);

  // Refs for audio control
  const audioRef = useRef(null);
  const stopTimerRef = useRef(null);

  // Fetch free audios
  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const res = await getRequest("/free-audio");
        if (res.success) {
          const samplesWithDownloads = res.data.map((sample) => ({
            ...sample,
            downloads: Math.floor(Math.random() * 50000) + 1000,
          }));
          setSamples(samplesWithDownloads);
        } else {
          setSamples([]);
        }
      } catch (err) {
        console.error("Error fetching audios:", err);
        setSamples([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAudios();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current);
      }
    };
  }, []);

  // Formatters
  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDownloadCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count;
  };

  // Audio Play
  const handlePlay = (sample) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
    }
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
    }

    const link = sample.audioUrl || (typeof sample.audioFile === 'string' && /^https?:\/\//i.test(sample.audioFile) ? sample.audioFile : null);
    if (!link) {
      toast.error("This audio is not yet available via secure URL.");
      return;
    }
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.src = link;
    audio.play().catch((err) => {
      console.error("Audio play error:", err, link);
      toast.error("Audio playback failed. Check console for details.");
    });

    stopTimerRef.current = setTimeout(() => {
      audio.pause();
      setPlayingId(null);
    }, 30000);

    audioRef.current = audio;
    setPlayingId(sample._id);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
    }
    setPlayingId(null);
  };

  // Email Submit
  const handleEmailSubmit = async (sample) => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    if (!consentChecked) {
      toast.error("Please agree to share your email");
      return;
    }

    setSendingId(sample._id); // 🔑 show loader for this card

    try {
      postRequest(
        "/free-audio/send-free-audio",
        {
          email,
          audioId: sample._id,
          audioTitle: sample.title,
          audioDescription: sample.description,
          audioUrl: sample.audioUrl || (typeof sample.audioFile === 'string' && /^https?:\/\//i.test(sample.audioFile) ? sample.audioFile : null),
        },
        (response) => {
          if (response?.data?.success) {
            toast.success("Full audio has been sent to your email!", {
              onClose: () => {
                setActiveCard(null);
                setEmail("");
                setConsentChecked(false);
              },
            });
          } else {
            toast.error("Failed to send email. Please try again.");
          }
          setSendingId(null); // 🔑 stop loader AFTER response
        },
        (error) => {
          console.error("Email send error:", error);
          toast.error("Error sending email. Please try again later.");
          setSendingId(null); // 🔑 stop loader AFTER error
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Error sending email. Please try again later.");
      setSendingId(null); // 🔑 stop loader AFTER unexpected failure
    }
  };

  const handleCloseCard = () => {
    setActiveCard(null);
    setEmail("");
    setConsentChecked(false);
  };

  const [descRef] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="free-samples" className="py-20 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h2 className="text-4xl md:text-5xl font-light font-cormorant text-white">
              Free <span className="text-rose-400">Samples</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 font-sans max-w-3xl mx-auto mb-4">
            Experience our intimate collection with these complimentary audio
            samples. Enjoy 30-second previews and request the full versions via
            email.
          </p>
          <div className="inline-flex items-center font-sans rounded-full font-semibold transition-colors bg-gradient-to-r from-[#562D37] to-[#562D37] text-white text-sm px-4 py-2">
            No payment required • Full audio via email
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {samples.map((sample) => (
            <div
              key={sample._id}
              className={clsx(
                "rounded-lg border shadow-sm bg-black/40 border-[#562D37] hover:border-[#562D37] backdrop-blur-sm",
                "shadow-[#562D37] hover:shadow-xl hover:shadow-[#562D37] transition-all duration-300 relative",
                "flex flex-col h-full"
              )}
            >
              <div className="absolute -top-2 -right-2 z-10">
                <div className="inline-flex items-center rounded-full font-sans px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-[#562D37] to-[#562D37] text-white">
                  <Gift className="w-3 h-3 mr-1" /> Free
                </div>
              </div>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-gray-300">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {sample.rating} Rating
                  </div>
                  <div className="inline-flex items-center font-sans rounded-full px-2.5 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-300 capitalize">
                    {sample.categoryId?.categoryName || "Uncategorized"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Volume2 className="w-6 h-6 text-[#562D37]" />
                  <h3 className="text-xl font-semibold font-cormorant text-white">
                    {sample.title}
                  </h3>
                </div>

                {/* Description */}
                <div
                  ref={descRef}
                  className={clsx(
                    "text-gray-300 mb-4 font-sans leading-relaxed text-sm",
                    "line-clamp-2 overflow-hidden relative transition-all duration-500",
                    "min-h-[3rem]"
                  )}
                >
                  {sample.description}
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {sample.duration ? formatDuration(sample.duration) : "0:00"}
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowDownToLine className="w-4 h-4" />
                    {formatDownloadCount(sample.downloads)}
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center w-full mb-4">
                  {playingId === sample._id ? (
                    <>
                      <div className="w-[85%]">
                        <button
                          className="w-full flex items-center justify-center gap-2 font-sans text-sm font-medium border border-[#562D37] text-rose-400 hover:bg-[#051715] h-9 bg-[#1f1d1e] rounded-md px-3"
                          onClick={handleStop}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                          </svg>
                          Playing...
                        </button>
                      </div>
                      <div className="w-[15%] flex justify-end">
                        <div className="audio-wave flex gap-[2px] items-end h-4">
                          <div
                            className="bar w-1 bg-rose-400 rounded-t animate-bar"
                            style={{ height: "40%" }}
                          />
                          <div
                            className="bar w-1 bg-rose-400 rounded-t animate-bar delay-100"
                            style={{ height: "80%" }}
                          />
                          <div
                            className="bar w-1 bg-rose-400 rounded-t animate-bar delay-200"
                            style={{ height: "60%" }}
                          />
                          <div
                            className="bar w-1 bg-rose-400 rounded-t animate-bar delay-300"
                            style={{ height: "90%" }}
                          />
                          <div
                            className="bar w-1 bg-rose-400 rounded-t animate-bar delay-400"
                            style={{ height: "50%" }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => handlePlay(sample)}
                      className="w-full flex items-center justify-center gap-2 font-sans text-sm font-medium border border-[#562D37] text-rose-400 hover:bg-[#051715] h-9 bg-[#1f1d1e] rounded-md px-3"
                    >
                      <Play className="w-4 h-4" />
                      Play 30s Preview
                    </button>
                  )}
                </div>

                {/* Email Form */}
                {activeCard === sample._id ? (
                  <>
                    <div className="flex items-center gap-2 mb-4 bg-[#1f1d1e] border border-[#562D37] rounded-lg px-3 py-2">
                      <Mail className="w-4 h-4 text-[#562D37]" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent text-sm text-white placeholder-gray-400 w-full focus:outline-none"
                      />
                    </div>
                    <div className="flex items-start gap-2 my-2 text-sm text-gray-300 font-sans">
                      <input
                        type="checkbox"
                        checked={consentChecked}
                        onChange={() => setConsentChecked(!consentChecked)}
                        className="mt-1 accent-rose-500"
                      />
                      <p>
                        I agree to share my email to receive my custom audio
                        request and updates.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEmailSubmit(sample)}
                        disabled={sendingId === sample._id}
                        className="inline-flex items-center justify-center font-sans text-sm bg-gradient-to-r from-[#562D37] to-[#562D37] text-white font-semibold py-3 px-6 rounded-lg shadow-lg w-full hover:scale-105 transition-all duration-300 disabled:opacity-50"
                      >
                        {sendingId === sample._id ? (
                          <div className="flex items-center gap-2">
                            <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Sending...
                          </div>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" /> Get Full Audio
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCloseCard}
                        className="text-sm text-gray-400 hover:text-[#562D37] border-white/20 bg-[#1C2129] px-5 py-3 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => setActiveCard(sample._id)}
                    className="inline-flex items-center justify-center font-sans text-sm bg-gradient-to-r from-[#562D37] to-[#562D37] text-white font-semibold py-3 px-6 rounded-lg shadow-lg w-full hover:scale-105 transition-all duration-300"
                  >
                    Get Full Version
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-16 max-w-2xl mx-auto px-4">
          <p className="text-gray-400 text-lg italic font-sans leading-relaxed">
            Unlock private audios that fulfill your deepest cravings. Premium
            intimacy, total discretion.
          </p>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Audio Wave Animation Styles */}
      <style jsx>{`
        @keyframes bar-animation {
          0% {
            transform: scaleY(0.3);
          }
          50% {
            transform: scaleY(1);
          }
          100% {
            transform: scaleY(0.3);
          }
        }
        .animate-bar {
          animation: bar-animation 1s infinite ease-in-out;
          transform-origin: bottom;
        }
        .delay-100 {
          animation-delay: -1.1s;
        }
        .delay-200 {
          animation-delay: -1.2s;
        }
        .delay-300 {
          animation-delay: -1.3s;
        }
        .delay-400 {
          animation-delay: -1.4s;
        }
        .loader {
          border-radius: 50%;
        }
      `}</style>
      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default SampleCards;
