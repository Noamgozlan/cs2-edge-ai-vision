import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  return (
    <section id="testimonials" className="py-24 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t("testimonials.title1")} <span className="text-gradient">{t("testimonials.title2")}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {testimonials.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6 bg-card border border-border"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">"{review.text}"</p>
              <div>
                <p className="text-sm font-semibold">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
