import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex R.",
    role: "CS2 Bettor • 3 Years",
    text: "CS2 Edge AI turned my betting around. The smart bet recommendations go way beyond match winner — the player prop insights alone are worth it.",
    avatar: "AR",
  },
  {
    name: "Marcus T.",
    role: "Semi-Pro Analyst",
    text: "The breakdowns are insane. Having real HLTV data powering every prediction means I'm not just guessing. My ROI went from -5% to +18%.",
    avatar: "MT",
  },
  {
    name: "Sarah K.",
    role: "Esports Enthusiast",
    text: "Even as a casual fan, the veto predictions and analysis help me understand matches better. The AI is spookily accurate on map outcomes.",
    avatar: "SK",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-28 bg-card/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-[11px] font-bold text-primary uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Trusted by <span className="text-primary">Thousands</span>
            </h2>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {testimonials.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-7 bg-card border border-border hover:border-primary/20 transition-all"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                "{review.text}"
              </p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-black text-primary">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.role}</p>
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
