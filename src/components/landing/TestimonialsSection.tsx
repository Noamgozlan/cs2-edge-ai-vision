import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex R.",
    role: "CS2 Bettor, 3 years",
    text: "CS2 Edge AI turned my betting around. The veto predictions alone are worth the subscription — I've hit 68% of my bets this month.",
  },
  {
    name: "Marcus T.",
    role: "Semi-pro Analyst",
    text: "The breakdowns are insane. It's like having a top-tier analyst on speed dial. The odds comparison saves me time every single day.",
  },
  {
    name: "Sarah K.",
    role: "Esports Enthusiast",
    text: "Even as a casual fan, the predictions and analysis help me understand matches so much better. The AI is spookily accurate.",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 relative">
      <div className="neon-line mb-24" />
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            What Our <span className="text-gradient">Users Say</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6 bg-card border border-border/50"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{t.text}"</p>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
