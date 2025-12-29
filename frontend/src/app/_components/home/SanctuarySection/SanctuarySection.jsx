import React from "react";
import { Shield, Lock, Eye, Zap, Heart, Star } from "lucide-react";

const iconMap = {
  shield: Shield,
  lock: Lock,
  eye: Eye,
  zap: Zap,
  heart: Heart,
  star: Star,
};

const features = [
  {
    icon: "shield",
    title: "Anonymous",
    text: "No accounts. No history. Just your message.",
  },
  {
    icon: "lock",
    title: "Secure",
    text: "Encrypted delivery. Your script is purged after creation.",
  },
  {
    icon: "eye",
    title: "Private",
    text: "Your privacy is our highest priority. Complete discretion guaranteed.",
  },
  {
    icon: "zap",
    title: "Premium Quality",
    text: "State-of-the-art AI technology delivers unmatched realism.",
  },
  {
    icon: "heart",
    title: "Personalized",
    text: "Every message is crafted specifically for your desires.",
  },
  {
    icon: "star",
    title: "Exclusive",
    text: "Limited access to our premium voice generation technology.",
  },
];

const SanctuarySection = () => {
  return (
    <section className="py-20 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light serif-heading font-cormorant text-white mb-6">
            Your <span className="text-[#FB7185]">Sanctuary</span>
          </h2>
          <p className="text-xl text-gray-300 font-sans max-w-3xl mx-auto">
            Built on principles of privacy, quality, and absolute discretion.
            Your intimate moments deserve nothing less than perfection.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={idx}
                className="rounded-lg border text-card-foreground shadow-sm bg-black/40 border-gray-600 hover:border-rose-400/30 backdrop-blur-sm h-full transition-all duration-300 hover:shadow-lg hover:shadow-rose-400/10"
              >
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#251119] rounded-full mb-6">
                    <Icon className="w-8 h-8 text-[#FB7185]" />
                  </div>
                  <h3 className="text-2xl font-semibold font-cormorant serif-heading text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 font-sans leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-2xl md:text-3xl font-cormorant font-light serif-heading text-gray-300 italic mb-8">
              "In a world of endless noise, we create whispers that matter."
            </blockquote>
            <p className="text-gray-400 font-sans">
              Every detail is designed to honor your privacy while delivering an
              experience that transcends the ordinary.
            </p>
          </div>
        </div>

        {/* <div className="mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-[#5D3B35] via-[#5D3B35] to-[#563D43] border-rose-400/30 backdrop-blur-sm">
              <div className="p-8 md:p-12 text-center">
                <h3 className="text-3xl md:text-4xl font-light font-cormorant serif-heading text-white mb-6">
                  Custom <span className="text-[#FB7185]">Creations</span> Coming
                  Soon
                </h3>
                <p className="text-xl text-gray-300 font-sans mb-8 leading-relaxed">
                  Your deepest fantasies, crafted into bespoke audio
                  experiences. Personalized scripts, your choice of voice,
                  unlimited possibilities.
                </p>

                <div className="space-y-6">
                  <div className="bg-[#563D3D] rounded-lg p-6 border border-rose-400/20">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-yellow-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <polygon
                          points="12 2 15.09 8.26 22 9.27 17 14.14 
                    18.18 21.02 12 17.77 5.82 21.02 
                    7 14.14 2 9.27 8.91 8.26 12 2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>

                      <span className="text-2xl font-bold text-yellow-400 font-sans">
                        50% OFF
                      </span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-yellow-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <polygon
                          points="12 2 15.09 8.26 22 9.27 17 14.14 
                    18.18 21.02 12 17.77 5.82 21.02 
                    7 14.14 2 9.27 8.91 8.26 12 2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-300 font-sans">
                      Join our exclusive list and be the first to access custom
                      audio creation with a special launch discount.
                    </p>
                  </div>

                  <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email for early access..."
                      className="flex h-10 w-full rounded-md border placeholder:font-sans font-sans ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 form-input flex-1 text-lg py-3 px-4 bg-black/40 border-gray-600 focus:border-rose-400 text-white placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      disabled
                      className="inline-flex cursor-pointer items-center justify-center font-sans text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 bg-primary hover:bg-primary/90 h-10 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0 whitespace-nowrap"
                    >
                      Join the List
                    </button>
                  </form>
                  <p className="text-sm text-gray-400 font-sans">
                    No spam, ever. Just exclusive access to the most intimate
                    audio experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default SanctuarySection;
