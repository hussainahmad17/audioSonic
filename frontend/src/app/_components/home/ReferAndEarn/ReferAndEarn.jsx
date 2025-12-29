import React, { useState, useRef, useEffect } from "react";
import {
  Filter,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  TrendingUp,
  UserPlus,
  Target,
  DollarSign,
  BarChart2,
  Calendar,
  ChevronUp,
  Copy, // Added Copy icon for referral link
  LayoutDashboard, // For Dashboard icon
  CreditCard, // For Payout Details icon
  Link, // For Referral Link icon
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postRequest } from "@app/backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    title: "Total Clicks",
    value: "12,450",
    change: "+12.5% this month",
    icon: <TrendingUp className="text-rose-400" />,
  },
  {
    title: "Total Signups",
    value: "387",
    change: "+8.3% this month",
    icon: <UserPlus className="text-rose-400" />,
  },
  {
    title: "Total Sales",
    value: "156",
    change: "+15.2% this month",
    icon: <Target className="text-rose-400" />,
  },
  {
    title: "Total Commission",
    value: "€2,847.5",
    change: "+18.7% this month",
    icon: <DollarSign className="text-rose-400" />,
  },
  {
    title: "Conversion Rate",
    value: "3.11%",
    change: "Above average",
    icon: <BarChart2 className="text-rose-400" />,
  },
  {
    title: "Avg Order Value",
    value: "€42.3",
    change: "+5.1% this month",
    icon: <Calendar className="text-rose-400" />,
  },
];

const useFormik = (config) => {
  const [values, setValues] = useState(config.initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (config.validationSchema) {
      validateField(name, values[name]);
    }
  };

  const validateField = (name, value) => {
    if (config.validationSchema) {
      try {
        config.validationSchema.validateSyncAt(name, { [name]: value });
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      } catch (error) {
        setErrors((prev) => ({ ...prev, [name]: error.message }));
      }
    }
  };

  const resetForm = () => {
    setValues(config.initialValues);
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    try {
      if (config.validationSchema) {
        config.validationSchema.validateSync(values, { abortEarly: false });
        setErrors({});
      }

      await config.onSubmit(values, { resetForm });
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        // Handle general errors not from validationSchema
        console.error("Submission error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
};

const validationSchema = {
  validateSync: (values, options) => {
    const errors = [];

    if (!values.firstName) {
      errors.push({ path: "firstName", message: "First name is required" });
    }

    if (!values.lastName) {
      errors.push({ path: "lastName", message: "Last name is required" });
    }

    if (!values.username) {
      errors.push({ path: "username", message: "Username is required" });
    }
    if (!values.referredByCode) {
      errors.push({
        path: "referredByCode",
        message: "Referral code is required",
      });
    }

    if (!values.email) {
      errors.push({ path: "email", message: "Email is required" });
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.push({ path: "email", message: "Invalid email address" });
    }

    if (!values.password) {
      errors.push({ path: "password", message: "Password is required" });
    } else if (values.password.length < 6) {
      errors.push({
        path: "password",
        message: "Password must be at least 6 characters",
      });
    }

    if (!values.confirmPassword) {
      errors.push({
        path: "confirmPassword",
        message: "Please confirm your password",
      });
    } else if (values.password !== values.confirmPassword) {
      errors.push({
        path: "confirmPassword",
        message: "Passwords do not match",
      });
    }

    if (errors.length > 0) {
      const error = new Error("Validation failed");
      error.inner = errors;
      throw error;
    }
  },

  validateSyncAt: (path, values) => {
    const value = values[path];

    switch (path) {
      case "firstName":
        if (!value) throw new Error("First name is required");
        break;
      case "lastName":
        if (!value) throw new Error("Last name is required");
        break;
      case "username":
        if (!value) throw new Error("Username is required");
        break;
      case "referredByCode":
        if (!value) throw new Error("Referral code is required");
        break;
      case "email":
        if (!value) throw new Error("Email is required");
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          throw new Error("Invalid email address");
        }
        break;
      case "password":
        if (!value) throw new Error("Password is required");
        if (value.length < 6)
          throw new Error("Password must be at least 6 characters");
        break;
      case "confirmPassword":
        if (!value) throw new Error("Please confirm your password");
        break;
      default:
        break;
    }
  },
};

const SignUpForm = ({ onToggleToSignIn, onSignUpSuccess }) => {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      referredByCode: "251cc915",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        postRequest(
          "/auth/register",
          values,
          (response) => {
            console.log("POST response:", response);

            if (response?.data?.token) {
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("user", JSON.stringify(response.data.user));

              resetForm();
              toast.success(response?.data?.message || "Signup successful!");
              onSignUpSuccess?.(); // call only if provided
            } else {
              toast.error(
                response?.data?.message ||
                "Signup successful but no token received"
              );
            }
          },
          (error) => {
            console.error("POST error:", error);
            toast.error(
              error.response?.data?.message ||
              error.message ||
              "Signup failed. Please try again."
            );
          }
        );
      } catch (error) {
        console.error("Signup error (outer try/catch):", error);
        toast.error(
          error.response?.data?.message ||
          error.message ||
          "Signup failed. Please try again."
        );
      }
    }
  });

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-rose-400/30 shadow-md rounded-xl p-8">
      <h3 className="text-2xl font-cormorant text-white mb-6 text-center">
        Create Your Account
      </h3>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <label className="block  text-sm font-medium text-gray-300 mb-2 font-sans">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 bg-black/40 border border-rose-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
              placeholder="Enter your first name"
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="text-rose-400 text-sm mt-1">
                {formik.errors.firstName}
              </p>
            )}
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 bg-black/40 border border-rose-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
              placeholder="Enter your last name"
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="text-rose-400 text-sm mt-1">
                {formik.errors.lastName}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 bg-black/40 border border-rose-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
              placeholder="Choose a username"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-rose-400 text-sm mt-1">
                {formik.errors.username}
              </p>
            )}
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 bg-black/40 border border-rose-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-rose-400 text-sm mt-1">
                {formik.errors.email}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 bg-black/40 border border-rose-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
              placeholder="Create a password"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-rose-400 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 bg-black/40 border border-rose-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
              placeholder="Confirm your password"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-rose-400 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>
        </div>
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full font-sans text-white font-bold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? "Creating Account..." : "Create Account"}
        </button>

        <button
          type="button"
          onClick={onToggleToSignIn}
          className="w-full text-sm text-rose-400 hover:text-rose-300 transition-colors mt-4"
        >
          Already have an account? Sign In
        </button>
      </form>
    </div>
  );
};

const SignInForm = ({ onToggleToSignUp, onSignInSuccess }) => {
  const { loading, login } = useAuth();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: {
      validateSync: (values, options) => {
        const errors = [];

        if (!values.email) {
          errors.push({ path: "email", message: "Email is required" });
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.push({ path: "email", message: "Invalid email address" });
        }

        if (!values.password) {
          errors.push({ path: "password", message: "Password is required" });
        }

        if (errors.length > 0) {
          const error = new Error("Validation failed");
          error.inner = errors;
          throw error;
        }
      },

      validateSyncAt: (path, values) => {
        const value = values[path];

        switch (path) {
          case "email":
            if (!value) throw new Error("Email is required");
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
              throw new Error("Invalid email address");
            }
            break;
          case "password":
            if (!value) throw new Error("Password is required");
            break;
          default:
            break;
        }
      },
    },


    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await login(
          {
            email: values.email,
            password: values.password,
          },
          { withCredentials: true } // 👈 if using axios
        );

        if (response) {
          if (response?.user) {
            // ✅ no token in localStorage anymore, cookies handle it
            localStorage.setItem("user", JSON.stringify(response.user));

            if (response.user.isAdmin) {
              navigate("/admin");
            } else {
              onSignInSuccess();
            }

            resetForm();
            toast.success(response?.msg || "Login successful!");
          } else {
            toast.error("Login failed - Invalid response");
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error(
          error?.response?.message ||
          error?.message ||
          "Login failed. Please try again."
        );
      }
    },

  });

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-rose-400/30 shadow-md rounded-xl p-8">
      <h3 className="text-2xl font-cormorant text-white mb-6 text-center">
        Sign In to Your Account
      </h3>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-3 bg-black/40 border border-rose-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
            placeholder="Enter your email"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-rose-400 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-3 bg-black/40 border border-rose-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
            placeholder="Enter your password"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-rose-400 text-sm mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full font-sans text-white font-bold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? "Signing In..." : "Sign In"}
        </button>

        <button
          type="button"
          onClick={onToggleToSignUp}
          className="w-full text-sm text-rose-400 hover:text-rose-300 transition-colors mt-4"
        >
          Don't have an account? Sign Up
        </button>
      </form>
    </div>
  );
};

const defaultTabs = ["Overview", "How It Works", "Payout Info", "FAQs"];
const loggedInTabs = [
  "Dashboard",
  "Payout Details",
  "Referral Link",
  "FAQs",
  "Logout",
];

const faqs = [
  {
    question: "What is this platform?",
    answer:
      "We are an online marketplace for soft-spoken ASMR and audio experiences, offering relaxing, intimate scenarios in various categories. Each audio is around 10 minutes, designed for personal relaxation or entertainment.",
  },
  {
    question: "How do I get started?",
    answer:
      "Scroll through our categories in the Audio Archive on the homepage, preview short clips, and check out the free samples section to try audios for free. Once you purchase, the audio will be sent to your email in MP4 format instantly. You can also scroll through our custom audio section for tailored experiences.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We use Stripe for secure payments, supporting major methods like Visa, Mastercard, Apple Pay, and Google Pay. All transactions are encrypted, and we don’t store your card details.",
  },
  {
    question: "Is it worth the money?",
    answer:
      "Yes. Every audio—whether custom or from our archive—is made with care, clear sound, and real emotion. These are not cheap or random files. You get soft, high-quality voice work, made to relax you, turn you on, or calm your mind—exactly how you want it. Delivery is fast. If you’re not happy, we give your money back within 14 days. Most customers return and buy more—because once they try it, they feel the difference",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Refunds within 14 days, no questions asked. Contact support@intimatly.com to process; expect 3-5 business days.",
  },
  {
    question: "How do custom requests work?",
    answer:
      "After you pay for a custom audio, send us the tailored details you want mentioned (it can be everything you wish for, even from your wildest dreams). We’ll provide a custom audio just for you within 24 hours, delivered exclusively to your email in MP3 format. Absolutely secure, private and descreet.",
  },
  {
    question: "How do I download and play the audio?",
    answer:
      "The audio is sent directly to your email in MP3 format upon purchase. Download it from there and play on any compatible device or app (e.g., VLC or built-in phone apps).",
  },
  {
    question: "Will my purchase be private?",
    answer:
      "Yes. On your bank statement, it will say “INMLY-MEDIA” – no adult words. Our emails also look normal. No pictures, no adult titles",
  },
  {
    question: "Will my privacy be safe?",
    answer:
      "We only use your email and payment info (handled by Stripe, which is 100% secure). We don’t sell your data. We follow European GDPR privacy laws.",
  },
  {
    question: "Are the audios really that good?",
    answer:
      "They are perfect. Up to this point, we haven’t received a single negative review. If you are not sure, just try the 30-second preview from each audio. They get better as they progress…",
  },
  {
    question: "Do you have an affiliate program?",
    answer:
      "Yes. Share your referral link with others. If someone buys, you get 33% of the money. We pay monthly using Stripe. Very easy. We use a platform called Rewardful for our Affiliate program.",
  },
];

const ReferAndEarn = () => {
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [openIndex, setOpenIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const answerRefs = useRef([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setSelectedTab("Dashboard");
    }
  }, []);

  const toggleFAQ = (idx) => {
    setOpenIndex((prevIndex) => (prevIndex === idx ? null : idx));
  };

  const handleJoinNow = () => {
    setShowForm(true);
    setIsSignUp(true);
  };

  const toggleFormType = () => {
    setIsSignUp(!isSignUp);
  };

  const handleBackToOverview = () => {
    setShowForm(false);
    setSelectedTab("Overview");
  };

  const handleSignUpSuccess = () => {
    setIsSignUp(false);
  };

  const handleSignInSuccess = () => {
    setIsLoggedIn(true);
    setShowForm(false);
    setSelectedTab("Dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setSelectedTab("Overview");
    toast.success("You have been logged out successfully");
  };

  const handleCopyReferralLink = () => {
    const referralLink = "https://yourwebsite.com/refer?code=YOUR_UNIQUE_CODE";
    // Use document.execCommand('copy') for better iframe compatibility
    const textArea = document.createElement("textarea");
    textArea.value = referralLink;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      toast.success("Referral link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy link. Please copy manually.");
    }
    document.body.removeChild(textArea);
  };

  useEffect(() => {
    faqs.forEach((_, i) => {
      const el = answerRefs.current[i];
      if (el) {
        el.style.height = openIndex === i ? `${el.scrollHeight}px` : "0px";
      }
    });
  }, [openIndex]);

  // Determine which set of tabs to display
  const currentTabs = isLoggedIn ? loggedInTabs : defaultTabs;

  return (
    <section
      id="faq"
      className="py-20 px-6 bg-transparent text-white font-sans"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light font-cormorant text-white mb-6">
            Refer <span className="text-rose-400">& Earn</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Earn 50% commission by sharing the voices you love. It only takes 1
            minute to join.
          </p>
        </div>

        {/* Tab Filter */}
        {!showForm && (
          <div className="mb-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-rose-400" />
              <h3 className="text-lg font-semibold text-white">
                Navigate Sections
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {currentTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    if (tab === "Logout") {
                      handleLogout();
                    } else {
                      setSelectedTab(tab);
                    }
                  }}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 transition-all duration-300 ${selectedTab === tab
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                    : "bg-black/40 border border-rose-400/50 text-rose-300 hover:bg-rose-400/10"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show Form or Tab Content */}
        {showForm ? (
          <div>
            <div className="text-center mb-6">
              <button
                onClick={handleBackToOverview}
                className="text-rose-400 hover:text-rose-300 transition-colors mb-4"
              >
                ← Back to Overview
              </button>
            </div>
            {isSignUp ? (
              <SignUpForm
                onToggleToSignIn={toggleFormType}
                onSignUpSuccess={handleSignUpSuccess}
              />
            ) : (
              <SignInForm
                onToggleToSignUp={toggleFormType}
                onSignInSuccess={handleSignInSuccess}
              />
            )}
          </div>
        ) : (
          /* Tab Content */
          <div className="bg-black/40 backdrop-blur-sm border border-rose-400/30 shadow-md rounded-xl p-8">
            {selectedTab === "Overview" && !isLoggedIn && (
              <div className="text-center">
                <h3 className="text-2xl font-cormorant text-white mb-4">
                  Earn Money Sharing Our Audios
                </h3>
                <p className="text-gray-300 text-md mb-6">
                  Every time someone buys using your link, you get paid. Simple.
                </p>
                <button
                  onClick={handleJoinNow}
                  className="inline-block text-white font-bold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
                >
                  Join Now
                </button>
              </div>
            )}

            {selectedTab === "How It Works" && !isLoggedIn && (
              <div className="space-y-6">
                {[
                  {
                    title: "Step 1: Sign Up",
                    desc: "Get your personal referral link in 60 seconds.",
                  },
                  {
                    title: "Step 2: Share Your Link",
                    desc: "Promote it on social media, DMs, or your website.",
                  },
                  {
                    title: "Step 3: Earn Commissions",
                    desc: "You'll receive 30% of every sale you refer.",
                  },
                ].map((step, i) => (
                  <div className="flex items-start gap-4" key={i}>
                    <ArrowRight className="w-6 h-6 text-rose-400 mt-1" />
                    <div>
                      <h4 className="text-xl font-semibold text-white">
                        {step.title}
                      </h4>
                      <p className="text-gray-300 text-md">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === "Payout Info" && !isLoggedIn && (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <DollarSign className="w-6 h-6 text-rose-400 mt-1" />
                  <div>
                    <h4 className="text-xl text-white">Payouts Made Monthly</h4>
                    <p className="text-gray-300 text-md">
                      We process affiliate payouts at the end of every month via
                      PayPal or Stripe. No minimum threshold. No hidden fees.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* New Tabs for Logged-in Users */}
            {selectedTab === "Dashboard" && isLoggedIn && (
              <div className="p-6 text-white">
                <h3 className="text-2xl font-cormorant text-center text-white mb-4">
                  Affiliate Dashboard Preview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats.map((item, index) => (
                    <div
                      key={index}
                      className="bg-[#1f1d1e] p-5 rounded-xl shadow-md hover:shadow-lg transition duration-200"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm text-gray-400">{item.title}</h4>
                        <div className="w-5 h-5">{item.icon}</div>
                      </div>
                      <div className="text-white text-lg">{item.value}</div>
                      {/* <div className="text-sm text-pink-400 mt-1">
                        {item.change}
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === "Payout Details" && isLoggedIn && (
              <div className="text-center  space-y-4 flex flex-col items-center">
                <CreditCard className="w-12 h-12 text-rose-400 mb-4" />
                <h3 className="text-2xl font-cormorant text-white mb-2">
                  Your Payout Information
                </h3>
                <p className="text-gray-300 text-md max-w-prose">
                  Payouts are processed at the end of each month. Please ensure
                  your payout details are up-to-date to receive your commissions
                  without delay. You can configure your preferred payout method
                  (e.g., PayPal, Stripe) in your account settings.
                </p>
                <p className="text-gray-400 text-sm mt-4">
                  This section will soon include detailed payout history and
                  configuration options.
                </p>
              </div>
            )}

            {selectedTab === "Referral Link" && isLoggedIn && (
              <div className="text-center  space-y-4 flex flex-col items-center">
                <Link className="w-12 h-12 text-rose-400 mb-4" />
                <h3 className="text-2xl font-cormorant text-white mb-2">
                  Your Unique Referral Link
                </h3>
                <p className="text-gray-300 text-md mb-4">
                  Share this link with your audience to start earning
                  commissions!
                </p>
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    readOnly
                    value="https://yourwebsite.com/refer?code=YOUR_UNIQUE_CODE"
                    className="w-full px-4 py-3 pr-12 bg-black/40 border border-rose-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                  />
                  <button
                    onClick={handleCopyReferralLink}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-rose-300 hover:text-rose-100 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  Remember to promote your link on social media, blogs, or
                  directly to friends!
                </p>
              </div>
            )}

            {selectedTab === "FAQs" && (
              <div className="space-y-4 ">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-rose-400/30 rounded-md bg-black/30 backdrop-blur-sm overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFAQ(idx)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-white transition"
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-6 h-6 text-rose-400" />
                        <span className="font-medium text-xl">
                          {faq.question}
                        </span>
                      </div>
                      {openIndex === idx ? (
                        <ChevronUp className="w-8 h-8 text-rose-400 transition-transform" />
                      ) : (
                        <ChevronDown className="w-8 h-8 text-rose-400 transition-transform" />
                      )}
                    </button>
                    <div
                      ref={(el) => (answerRefs.current[idx] = el)}
                      className="overflow-hidden transition-all duration-500 ease-in-out"
                      style={{ height: "0px" }}
                    >
                      <div className="px-4 pb-4 text-md text-gray-300">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </section>
  );
};

export default ReferAndEarn;
