import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechStart USA',
    content: 'Their AI agent integration transformed our workflow. The SLM system they built is incredibly accurate and efficient.',
    rating: 5,
    avatar: '🇺🇸'
  },
  {
    name: 'Danny',
    role: 'Founder &CEO, Denny Concepcion Concepcion',
    content: 'Outstanding mobile app development. They delivered a cross-platform solution that exceeded our expectations.',
    rating: 5,
    avatar: '🇺🇸'
  },
  {
    name: 'Priya Sharma',
    role: 'Founder, Digital Solutions',
    content: 'The website they created for us is next-level. Fast, responsive, and beautifully designed. Highly recommend!',
    rating: 5,
    avatar: '🇮🇳'
  },
  {
    name: 'James Chen',
    role: 'Product Manager, CloudTech',
    content: 'Their technical consulting helped us scale globally. Professional, knowledgeable, and results-driven.',
    rating: 5,
    avatar: '🇬🇧'
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 xl:py-32 bg-background">
      <div className="container px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl xl:text-5xl font-bold mb-4">
            What Our <span className="gradient-text">Clients</span> Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Trusted by businesses worldwide for delivering extraordinary tech solutions
          </p>
        </motion.div>

        <div className="grid gap-8 xl:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-border hover:border-primary/50 transition-all duration-300 card-3d h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <Quote className="h-8 w-8 text-primary/20 mb-4" />

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full">
            <Star className="h-5 w-5 text-primary" />
            <span className="font-medium">4.9/5 Average Rating from 200+ Reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}