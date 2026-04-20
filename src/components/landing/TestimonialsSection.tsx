import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "The live odds comparison alone paid for itself in a week. Catching line movement across Pinnacle and GG.BET before they sync is a massive advantage.",
    author: "Alex M.",
    role: "Professional Bettor",
    initials: "AM",
  },
  {
    quote: "CS2Edge's prop analysis on map vetos is insane. Finding a +120 edge on an opening kill prop because of a specific CT setup trend is invaluable.",
    author: "David S.",
    role: "Data Analyst",
    initials: "DS",
  },
  {
    quote: "Finally, a tool that treats esports betting like a financial market. Clean interface, no clutter, just the numbers that matter.",
    author: "Sarah K.",
    role: "Casual Trader",
    initials: "SK",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-landing-display text-3xl text-white sm:text-4xl">
            Trusted by traders
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-white/[0.45]">
            Real feedback from people who use CS2Edge as their daily analysis layer.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="landing-surface relative flex flex-col justify-between rounded-2xl p-6"
            >
              <Quote className="absolute right-6 top-6 h-6 w-6 text-white/[0.04]" />
              
              <p className="relative z-10 text-[14px] leading-relaxed text-white/[0.6]">
                "{testimonial.quote}"
              </p>
              
              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-xs font-semibold text-white/[0.7]">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{testimonial.author}</p>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-white/[0.4]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
