import React from "react";
import { MessageSquareHeart, Quote } from "lucide-react";

const reviews = [
  {
    text: `I went through an ugly breakup earlier this year. Could barely sleep, eat, or function.
    Randomly stumbled onto these audios one sleepless night and took a chance. It's crazy, but
    this soft-spoken voice pulled me back from the edge. It gave me company, warmth, and
    something I’d lost: hope. Sounds dramatic, but it genuinely saved me.`,
    name: "Lucas",
  },
  {
    text: `I’ve struggled with chronic insomnia and depression for ages. Pills, therapy, meditation.
    Nothing stuck. Bought one audio here as a last-ditch effort. It’s weird, but hearing someone
    whisper calmly felt deeply personal, like genuine human connection.`,
    name: "Camille",
  },
  {
    text: `Honestly, I've always felt invisible and unheard and weirdly enough, buying that audio here
    changed that. The voice made me feel acknowledged, cared for, and seen. For once,
    someone was gently talking just to me, and that has changd my life in ways I can’t describe.`,
    name: "Emilia",
  },
  {
    text: `Bought my first audio as a joke. Ended up with goosebumps and a boner. Bought three
    more. Now im falling asleep to it every night. Or im doing.. some other stuff iykyk.`,
    name: "Chloé",
  },
  {
    text: `The quality here is unmatched. Voices are soft, close, almost hauntingly intimate. It feels
    personal, comforting, and real.`,
    name: "Lina",
  },
  {
    text: `This is like therapy, honestly. Had trouble sleeping for years and nothing helped—not meds,
    not meditation apps. One audio here put me out cold in ten minutes. Whatever magic they're
    doing, I want more.`,
    name: "Harry",
  },
  {
    text: `I had super high expectations after reading other reviews and they somehow surpassed
    them. Best money spent in ages.`,
    name: "George",
  },
  {
    text: `Bought one after a breakup. Expected nothing special but ended up feeling comforted in
    ways I didn't know I needed.`,
    name: "Olivia",
  },
  {
    text: `Honestly, I've always felt invisible and unheard and weirdly enough, buying that audio here
    changed that. The voice made me feel acknowledged, cared for, and seen. For once,
    someone was gently talking just to me, and that has changd my life in ways I can’t describe.`,
  },
  {
    text: `I had super high expectations after reading other reviews and they somehow surpassed
    them. Best money spent in ages.`,
    name: "George",
  },
];

const getBlurClass = (index) => {
  if (index < 4) return "blur-none opacity-100";
  if (index < 6) return "blur-[1px] opacity-90";
  if (index < 8) return "blur-[2px] opacity-80"; 
  return "blur-[3px] opacity-70";
};

const ReviewsSection = () => {
  return (
    <section className="bg-transparent text-gray-300 px-6 py-20" id="reviews">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquareHeart className="w-6 h-6 text-rose-400" />
            <h2 className="text-4xl md:text-5xl font-light font-cormorant text-white">
              Customer <span className="text-rose-400">Reviews</span>
            </h2>
            <MessageSquareHeart className="w-6 h-6 text-rose-400" />
          </div>
          <p className="text-gray-400 text-base font-sans max-w-xl mx-auto">
            Real stories from real people — comfort, connection, and more than
            just audio.
          </p>
        </div>

        <div className="space-y-8 relative">
          {reviews.slice(0, 10).map((review, i) => (
            <div
              key={i}
              className={`relative pl-6 transition-all duration-700 ${getBlurClass(i)}`}
            >
              <Quote className="absolute top-0 left-0 w-4 h-4 text-rose-400" />
              <p className="text-sm leading-relaxed font-sans text-gray-200">
                {`“${review.text.trim()}”`}
              </p>
              <p className="mt-2 text-sm font-semibold text-rose-400 font-sans">
                {`__ ${review.name}`}
              </p>
            </div>
          ))}

          <div className="text-center pt-8">
            <button className="text-rose-400 text-lg font-semibold font-sans underline underline-offset-4 hover:text-rose-300 transition-all">
              See 56+ more reviews
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
