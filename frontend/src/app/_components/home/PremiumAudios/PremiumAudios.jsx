import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Star,
  Volume2,
  Clock,
  Filter,
  Search,
  Mail,
  X,
  Download,
  ChevronDown,
  Loader2
} from "lucide-react";
import axios from "axios";
import { API_BASE_URL, AUDIO_BASE_URL } from "@app/backendServices/ApiCalls";

// API configuration (env-driven for Vercel/local)
const API_URL = API_BASE_URL;
const AUDIO_URL = `${AUDIO_BASE_URL}/paid-audios`;

const voiceOptions = ["Male", "Female"];
const languageOptions = ["English", "Spanish"];

// Custom Select Component
const CustomSelect = ({ options, value, onChange, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg bg-black/40 border ${
          isOpen ? "border-rose-400" : "border-rose-400/50"
        } text-rose-300 font-sans text-sm`}
      >
        {value || placeholder}
        <ChevronDown
          className={`w-4 h-4 ml-2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg bg-black/90 border border-rose-400/50 shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-rose-500/20 ${
                value === option ? "text-rose-400 font-medium" : "text-gray-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PremiumAudios = () => {
  // State management
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [premiumAudios, setPremiumAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [activeCard, setActiveCard] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterButtonTop, setFilterButtonTop] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visibleCount, setVisibleCount] = useState(9);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Refs for audio control
  const audioRef = useRef(null);
  const stopTimerRef = useRef(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, audiosRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/paid-audio`)
        ]);

        setCategories(categoriesRes.data.data || []);
        const formattedAudios = audiosRes.data.data.map(audio => ({
          ...audio,
          id: audio._id,
          category: audio.categoryId?.categoryName || "Uncategorized",
          subcategories: audio.subcategoryId
            ? [audio.subcategoryId.Name]  // Use .Name property
            : ["General"],
          voice: audio.voice || "Unknown", // ensure voice is stored
          language: audio.language || "Unknown", // ensure language is stored
          price: `$${audio.priceAmount.toFixed(2)}`,
          priceAmount: audio.priceAmount,
          duration: formatDuration(audio.duration),
          downloads: formatDownloadCount(audio.downloads || Math.floor(Math.random() * 5000) + 1000)
        }));

        setPremiumAudios(formattedAudios);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "All") {
      const category = categories.find(c => c._id === selectedCategory);
      if (category) {
        const fetchSubcategories = async () => {
          try {
            const res = await axios.get(
              `${API_URL}/sub-categories/category/${category._id}`
            );
            setSubcategories(res.data.data || []);
          } catch (error) {
            console.error("Error fetching subcategories:", error);
            setSubcategories([]);
          }
        };
        fetchSubcategories();
      }
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, categories]);

  // Format duration helper
  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format download count
  const formatDownloadCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count;
  };

  // Build category data structure for UI
  const categoryData = categories.reduce((acc, category) => {
    acc[category.categoryName] = subcategories
      .filter(sub => sub.categoryId === category._id)
      .map(sub => sub.Name);
    return acc;
  }, {});

  // Handle audio preview
  const handlePlay = useCallback((audio, idx) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingIndex(null);
    }

    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
    }

    // Create new audio instance
    const audioElement = new Audio(`${AUDIO_URL}/${audio.audioFile}`);
    audioElement.play();

    // Set timeout to stop after 30 seconds
    stopTimerRef.current = setTimeout(() => {
      audioElement.pause();
      setPlayingIndex(null);
    }, 30000);

    audioRef.current = audioElement;
    setPlayingIndex(idx);
  }, []);

  // Stop audio playback
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
    }
    setPlayingIndex(null);
  };

  // Handle payment with Stripe Checkout
  const handlePayment = async (audio) => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    if (!consentChecked) {
      alert("Please agree to share your email");
      return;
    }

    setProcessingPayment(true);

    try {
      // Create checkout session
      const response = await axios.post(
        `${API_URL}/paid-audio/create-checkout-session`,
        {
          audioId: audio.id,
          email,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.href
        }
      );

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
      setProcessingPayment(false);
    }
  };
  
  // Scroll handling for mobile filter button
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (window.innerWidth < 768) {
        if (currentScrollY < lastScrollY) {
          if (filterButtonTop !== window.innerHeight * 0.3) {
            setFilterButtonTop(window.innerHeight * 0.3);
          }
        } else {
          if (filterButtonTop !== 0) {
            setFilterButtonTop(0);
          }
        }
        setLastScrollY(currentScrollY);
      } else {
        setFilterButtonTop(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, filterButtonTop]);

  useEffect(() => {
    setVisibleCount(9);
  }, [
    selectedCategory,
    selectedSubcategories,
    selectedVoice,
    selectedLanguage,
  ]);

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory("All");
    }
  }, [categories]);

  const mainCategories = [
    { id: "All", name: "All" },
    ...categories.map(c => ({ id: c._id, name: c.categoryName }))
  ];

  const getActiveFilters = () => {
    const filters = [];
    if (selectedCategory !== "All") {
      const category = categories.find(c => c._id === selectedCategory);
      if (category) {
        filters.push({ type: "Category", value: category.categoryName });
      }
    }
    
    selectedSubcategories.forEach((subId) => {
      const subcategory = subcategories.find(s => s._id === subId);
      if (subcategory) {
        filters.push({ type: "Subcategory", value: subcategory.Name });
      }
    });
    
    if (selectedVoice !== "All")
      filters.push({ type: "Voice", value: selectedVoice });
    if (selectedLanguage !== "All")
      filters.push({ type: "Language", value: selectedLanguage });
    return filters;
  };

  const removeFilter = (filterToRemove) => {
    if (filterToRemove.type === "Category") {
      setSelectedCategory("All");
      setSelectedSubcategories([]);
    } else if (filterToRemove.type === "Subcategory") {
      setSelectedSubcategories((prev) =>
        prev.filter((id) => {
          const subcategory = subcategories.find(s => s._id === id);
          return subcategory && subcategory.Name !== filterToRemove.value;
        })
      );
    } else if (filterToRemove.type === "Voice") {
      setSelectedVoice("All");
    } else if (filterToRemove.type === "Language") {
      setSelectedLanguage("All");
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSelectedSubcategories([]);
    setSelectedVoice("All");
    setSelectedLanguage("All");
  };

  const handleSubcategoryChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSubcategories((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const filteredAudios = premiumAudios.filter((audio) => {
    // Category filter (by ID)
    const categoryMatch =
      selectedCategory === "All" ||
      audio.categoryId?._id === selectedCategory;
    
    // Subcategory filter (by ID)
    const subcategoryMatch =
      selectedSubcategories.length === 0 ||
      (audio.subcategoryId && 
       selectedSubcategories.includes(audio.subcategoryId._id));

    const voiceMatch =
      selectedVoice === "All" ||
      audio.voice?.toLowerCase().trim() === selectedVoice.toLowerCase().trim();

    const languageMatch =
      selectedLanguage === "All" ||
      audio.language?.toLowerCase().trim() === selectedLanguage.toLowerCase().trim();

    return categoryMatch && subcategoryMatch && voiceMatch && languageMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <section
      id="browse-library"
      className="py-20 px-6 bg-transparent text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light font-cormorant text-white mb-6">
            Audio <span className="text-rose-400">Library</span>
          </h2>
          <p className="text-xl text-gray-300 font-sans max-w-3xl mx-auto">
            Carefully crafted intimate moments, ready to be yours. Each
            experience designed to fulfill your deepest desires.
          </p>
        </div>
        <div
          className="md:hidden fixed left-0 right-0 z-40 bg-black/80 py-3 px-6 border-b border-rose-400/20 transition-all duration-300 ease-in-out"
          style={{ top: `${filterButtonTop}px` }}
        >
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-full bg-gradient-to-r from-rose-500 justify-between font-sans to-pink-500 text-white font-bold py-3 px-[6%] rounded-lg flex items-center shadow-lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Filter Audios
          </button>
        </div>

        <div className="hidden md:block">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-rose-400" />
              <h3 className="text-lg font-semibold font-sans text-white">
                Filter by Category
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {mainCategories.map((category) => {
                const isSelected = selectedCategory === category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedSubcategories([]);
                    }}
                    className={`inline-flex items-center font-sans justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                        : "bg-black/40 border border-rose-400/50 text-rose-300 hover:bg-rose-400/10"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-12 bg-black/30 p-6 rounded-lg border border-rose-400/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <CustomSelect
                options={mainCategories
                  .filter(cat => cat.id !== "All")
                  .map(cat => cat.name)}
                value={
                  selectedCategory === "All" 
                    ? "" 
                    : mainCategories.find(c => c.id === selectedCategory)?.name || ""
                }
                onChange={(value) => {
                  const category = mainCategories.find(c => c.name === value);
                  setSelectedCategory(category ? category.id : "All");
                  setSelectedSubcategories([]);
                }}
                placeholder="Select Category"
                className="md:col-span-1"
              />

              <CustomSelect
                options={["All", ...voiceOptions]}
                value={selectedVoice === "All" ? "" : selectedVoice}
                onChange={(value) => setSelectedVoice(value || "All")}
                placeholder="Select Voice"
                className="md:col-span-1"
              />

              <CustomSelect
                options={["All", ...languageOptions]}
                value={selectedLanguage === "All" ? "" : selectedLanguage}
                onChange={(value) => setSelectedLanguage(value || "All")}
                placeholder="Select Language"
                className="md:col-span-1"
              />
            </div>

            {selectedCategory !== "All" && subcategories.length > 0 && (
              <div className="mb-6">
                <p className="text-center text-sm text-gray-400 mb-3 font-sans">
                  Subcategories:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {subcategories.map((subcategory) => (
                    <label
                      key={subcategory._id}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-sans font-medium transition-all duration-300 cursor-pointer ${
                        selectedSubcategories.includes(subcategory._id)
                          ? "bg-rose-500/20 border-rose-400/70 text-rose-300"
                          : "bg-black/40 border-rose-400/30 text-rose-300 hover:bg-rose-400/10"
                      } border`}
                    >
                      <input
                        type="checkbox"
                        value={subcategory._id}
                        checked={selectedSubcategories.includes(subcategory._id)}
                        onChange={handleSubcategoryChange}
                        className="form-checkbox text-rose-500 rounded focus:ring-rose-500"
                      />
                      {subcategory.Name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {getActiveFilters().length > 0 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
                <span className="text-sm text-gray-400 font-sans">
                  Active filters:
                </span>
                {getActiveFilters().map((filter, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-rose-500/20 text-rose-300 px-2 py-1 rounded-full text-xs font-sans"
                  >
                    <span>{filter.value}</span>
                    <button
                      onClick={() => removeFilter(filter)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-gray-400 hover:text-rose-400 underline font-sans"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsDrawerOpen(false)}
            ></div>

            <div className="relative bg-[#1c1c1c] w-full rounded-t-2xl p-6 shadow-lg transform transition-transform duration-300 ease-out translate-y-0 h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b border-rose-400/20 pb-4">
                <h3 className="text-xl font-semibold font-sans text-white">
                  Filter Audios
                </h3>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2 font-sans">
                    Category:
                  </p>
                  <CustomSelect
                    options={mainCategories
                      .filter(cat => cat.id !== "All")
                      .map(cat => cat.name)}
                    value={
                      selectedCategory === "All" 
                        ? "" 
                        : mainCategories.find(c => c.id === selectedCategory)?.name || ""
                    }
                    onChange={(value) => {
                      const category = mainCategories.find(c => c.name === value);
                      setSelectedCategory(category ? category.id : "All");
                      setSelectedSubcategories([]);
                    }}
                    placeholder="Select Category"
                  />
                </div>
                {selectedCategory !== "All" && subcategories.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2 font-sans">
                      Subcategories:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {subcategories.map((subcategory) => (
                        <label
                          key={subcategory._id}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-sans font-medium transition-all duration-300 cursor-pointer ${
                            selectedSubcategories.includes(subcategory._id)
                              ? "bg-rose-500/20 border-rose-400/70 text-rose-300"
                              : "bg-black/40 border-rose-400/30 text-rose-300 hover:bg-rose-400/10"
                          } border`}
                        >
                          <input
                            type="checkbox"
                            value={subcategory._id}
                            checked={selectedSubcategories.includes(
                              subcategory._id
                            )}
                            onChange={handleSubcategoryChange}
                            className="form-checkbox text-rose-500 rounded focus:ring-rose-500"
                          />
                          {subcategory.Name}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2 font-sans">Voice:</p>
                  <div className="flex flex-wrap gap-3">
                    {voiceOptions.map((voice) => (
                      <label
                        key={voice}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-sans font-medium transition-all duration-300 cursor-pointer ${
                          selectedVoice === voice
                            ? "bg-rose-500/20 border-rose-400/70 text-rose-300"
                            : "bg-black/40 border-rose-400/30 text-rose-300 hover:bg-rose-400/10"
                        } border`}
                      >
                        <input
                          type="radio"
                          name="voice"
                          value={voice}
                          checked={selectedVoice === voice}
                          onChange={(e) => setSelectedVoice(e.target.value)}
                          className="form-radio text-rose-500 rounded focus:ring-rose-500"
                        />
                        {voice}
                      </label>
                    ))}
                    <label
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-sans font-medium transition-all duration-300 cursor-pointer ${
                        selectedVoice === "All"
                          ? "bg-rose-500/20 border-rose-400/70 text-rose-300"
                          : "bg-black/40 border-rose-400/30 text-rose-300 hover:bg-rose-400/10"
                      } border`}
                    >
                      <input
                        type="radio"
                        name="voice"
                        value="All"
                        checked={selectedVoice === "All"}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                        className="form-radio text-rose-500 rounded focus:ring-rose-500"
                      />
                      All
                    </label>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-2 font-sans">
                    Language:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {languageOptions.map((language) => (
                      <label
                        key={language}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-sans font-medium transition-all duration-300 cursor-pointer ${
                          selectedLanguage === language
                            ? "bg-rose-500/20 border-rose-400/70 text-rose-300"
                            : "bg-black/40 border-rose-400/30 text-rose-300 hover:bg-rose-400/10"
                        } border`}
                      >
                        <input
                          type="radio"
                          name="language"
                          value={language}
                          checked={selectedLanguage === language}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="form-radio text-rose-500 rounded focus:ring-rose-500"
                        />
                        {language}
                      </label>
                    ))}
                    <label
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-sans font-medium transition-all duration-300 cursor-pointer ${
                        selectedLanguage === "All"
                          ? "bg-rose-500/20 border-rose-400/70 text-rose-300"
                          : "bg-black/40 border-rose-400/30 text-rose-300 hover:bg-rose-400/10"
                      } border`}
                    >
                      <input
                        type="radio"
                        name="language"
                        value="All"
                        checked={selectedLanguage === "All"}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="form-radio text-rose-500 rounded focus:ring-rose-500"
                      />
                      All
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-rose-400/20">
                <button
                  onClick={() => {
                    clearAllFilters();
                    setIsDrawerOpen(false);
                  }}
                  className="text-sm text-gray-400 hover:text-rose-400 underline font-sans"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {getActiveFilters().length > 0 && (
          <div className="flex flex-wrap justify-center md:hidden items-center gap-2 mt-4 mb-8">
            <span className="text-sm text-gray-400 font-sans">
              Active filters:
            </span>
            {getActiveFilters().map((filter, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-rose-500/20 text-rose-300 px-2 py-1 rounded-full text-xs font-sans"
              >
                <span>{filter.value}</span>
                <button
                  onClick={() => removeFilter(filter)}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs text-gray-400 hover:text-rose-400 underline font-sans"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAudios.slice(0, visibleCount).map((audio, idx) => (
            <div
              key={audio.id}
              className="rounded-lg border text-card-foreground shadow-sm bg-black/40 border-gray-600 hover:border-rose-400/50 backdrop-blur-sm shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-300 h-full relative"
            >
              {audio.featured && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="inline-flex items-center font-sans rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                    <Star className="w-3 h-3 mr-1" /> Featured
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {audio.rating} Rating
                  </div>
                  <div className="inline-flex items-center font-sans rounded-full px-2.5 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-300 capitalize">
                    {audio.category}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <Volume2 className="w-6 h-6 text-rose-400" />
                  <h3 className="text-xl font-semibold font-cormorant text-white">
                    {audio.title}
                  </h3>
                </div>

                <p className="text-gray-300 mb-4 font-sans text-sm leading-relaxed">
                  {audio.description}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                  <div className="flex items-center font-sans gap-1">
                    <Clock className="w-4 h-4" /> {audio.duration}
                  </div>
                  <div className="flex items-center font-sans gap-1">
                    <Download className="w-4 h-4" /> {audio.downloads}
                  </div>
                </div>
                <div className="text-2xl font-bold font-sans text-rose-400 mb-2">
                  {audio.price}
                </div>
                <>
                  <div className="flex items-center mb-3 w-full">
                    {playingIndex === idx ? (
                      <>
                        <div className="w-full">
                          <button
                            onClick={handleStop}
                            className="inline-flex items-center justify-center font-sans text-sm font-medium border border-rose-400/50 text-rose-400 hover:bg-[#1f1d1e] h-9 bg-[#1f1d1e] py-3 px-6 rounded-lg shadow-lg w-full transition-all"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="lucide lucide-pause w-4 h-4 mr-2"
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
                          <div className="audio-wave ml-2 flex gap-[2px] items-end">
                            <div className="bar animate-pulse bg-rose-400 w-1 h-3" />
                            <div
                              className="bar animate-pulse bg-rose-400 w-1 h-5"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="bar animate-pulse bg-rose-400 w-1 h-2"
                              style={{ animationDelay: "0.2s" }}
                            />
                            <div
                              className="bar animate-pulse bg-rose-400 w-1 h-4"
                              style={{ animationDelay: "0.3s" }}
                            />
                            <div
                              className="bar animate-pulse bg-rose-400 w-1 h-3"
                              style={{ animationDelay: "0.4s" }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => handlePlay(audio, idx)}
                        className="w-full flex items-center justify-center gap-2 font-sans text-sm font-medium border border-rose-400/50 text-rose-400 hover:bg-[#1f1d1e] h-9 bg-[#1f1d1e] rounded-md px-3"
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <polygon points="6 3 20 12 6 21 6 3"></polygon>
                        </svg>
                        Preview The Audio (30s)
                      </button>
                    )}
                  </div>

                  {activeCard === audio.id ? (
                    paymentSuccess ? (
                      <div className="text-center py-4">
                        <div className="text-green-400 text-lg mb-2">
                          Payment successful!
                        </div>
                        <p className="text-gray-300 mb-4">
                          Your audio is being sent to your email.
                        </p>
                        <button
                          onClick={() => {
                            setActiveCard(null);
                            setEmail("");
                            setConsentChecked(false);
                            setPaymentSuccess(false);
                          }}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-lg"
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center border-rose-400/50 bg-[#1f1d1e] gap-2 mb-4 border rounded-lg px-3 py-2 text-white">
                          <Mail className="w-4 h-4 text-rose-400" />
                          <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent text-sm placeholder-gray-400 w-full focus:outline-none"
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
                        
                        <div className="flex flex-row gap-2 w-full">
                          <button
                            onClick={() => handlePayment(audio)}
                            disabled={processingPayment}
                            className="w-full flex items-center justify-center bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold px-1 py-3 md:px-6 rounded-lg transition-transform hover:scale-105 shadow-lg disabled:opacity-50"
                          >
                            {processingPayment ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              `Pay ${audio.price}`
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setActiveCard(null);
                              setEmail("");
                              setConsentChecked(false);
                            }}
                            className="text-sm text-gray-400 hover:text-red-500 border border-white/20 bg-[#1C2129] px-5 py-3 rounded-lg transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setActiveCard(audio.id);
                          setPaymentSuccess(false);
                        }}
                        className="flex-1 bg-gradient-to-r font-sans from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition hover:scale-105"
                      >
                        Get Full Version
                      </button>
                    </div>
                  )}
                </>
              </div>
            </div>
          ))}
        </div>
        {visibleCount < filteredAudios.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 9)}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-lg shadow-md transition-transform hover:scale-105"
            >
              View More
            </button>
          </div>
        )}

        {filteredAudios.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 font-sans text-lg">
              No audios match your current filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-sans text-sm transition"
            >
              Clear All Filters
            </button>
          </div>
        )}

        <div className="text-center mt-16">
          <p className="text-gray-400 font-sans text-lg italic">
            "Try your intimate collection risk-free. Full versions delivered
            instantly to your private inbox."
          </p>
        </div>
      </div>

      {/* Audio Wave Animation Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5); }
        }
        .animate-pulse {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default PremiumAudios;