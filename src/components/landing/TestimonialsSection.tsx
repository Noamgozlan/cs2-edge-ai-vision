import { motion } from "framer-motion";
import { Star, TrendingUp, Users, ShieldCheck, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Daniel K.",
    role: "High-volume CS2 bettor",
    initials: "DK",
    accent: "#4d7cff",
    quote:
      "This finally feels like a real operating system for CS2 markets. I can compare books, check player angles, and validate the read without losing momentum.",
  },
  {
    name: "Noa S.",
    role: "Data-first esports analyst",
    initials: "NS",
    accent: "#2bd0b0",
    quote:
      "The product feels premium because the hierarchy is honest. I know what the model likes, where the line is best, and what risk breaks the thesis.",
  },
  {
    name: "Eli R.",
    role: "Props specialist",
    initials: "ER",
    accent: "#9b8cff",
    quote:
      "The player prop framing is what keeps me here. It doesn't dump data on me — it surfaces the exact context I need to act fast.",
  },
];

const stats = [
  { icon: TrendingUp, value: "73.2%", label: "Model win rate framing", accent: "#4d7cff" },
  { icon: Users, value: "8.4K", label: "Active weekly users", accent: "#2bd0b0" },
  { icon: ShieldCheck, value: "24/7", label: "Automated market monitoring", accent: "#9b8cff" },
];

const TestimonialsSection = () => {
  return (
    <section className="relative border-t border-white/6 py-24 sm:py-28">
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#2bd0b0]/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="landing-section-label text-xs font-semibold uppercase">Social Proof</p>
          <h2
            className="font-landing-display mt-4 text-4xl font-semibold sm:text-5xl"
            style={{
              background: "linear-gradient(135deg, #ffffff 40%, #9fb7ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Trusted by bettors who want signal, not noise.
          </h2>
          <p className="mx-auto mt-5 max-w-[58ch] text-base leading-8 text-white/50">
            Real feedback from people who use Gozlan BETS as their daily analysis layer.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="relative overflow-hidden rounded-[22px] px-6 py-5"
              style={{
                background: "linear-gradient(180deg, rgba(14,18,28,0.9) 0%, rgba(9,12,18,0.9) 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl opacity-50" style={{ background: stat.accent + "20" }} />
              <div className="flex items-center gap-4">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10"
                  style={{ background: stat.accent + "18" }}
                >
                  <stat.icon className="h-5 w-5" style={{ color: stat.accent }} />
                </div>
                <div>
                  <p className="font-mono-data text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-sm text-white/48">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial cards */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3 }}
              className="relative overflow-hidden rounded-[22px] p-6 sm:p-7"
              style={{
                background: "linear-gradient(180deg, rgba(14,18,28,0.9) 0%, rgba(9,12,18,0.9) 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Quote icon */}
              <div
                className="absolute top-5 right-5 opacity-15"
                style={{ color: testimonial.accent }}
              >
                <Quote className="h-8 w-8" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current text-[#f0c040]" />
                ))}
              </div>

              <p className="mt-5 text-sm leading-8 text-white/72">&ldquo;{testimonial.quote}&rdquo;</p>

              <div className="mt-7 flex items-center gap-3 border-t border-white/7 pt-5">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${testimonial.accent}50, ${testimonial.accent}20)`, border: `1px solid ${testimonial.accent}30` }}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-white/42">{testimonial.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
