"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Heart, Leaf, Users } from "lucide-react"
import { CounterAnimation } from "@/components/counter-animation"
import { motion } from "framer-motion"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Passion for Fragrance",
      description: "We believe that fragrance is an art form that tells a story and evokes emotions.",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Every product in our collection meets the highest standards of quality and authenticity.",
    },
    {
      icon: Leaf,
      title: "Natural Ingredients",
      description: "We source the finest natural ingredients from around the world for our exclusive blends.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction is our priority, and we're committed to exceptional service.",
    },
  ]

  const milestones = [
    { year: "2018", event: "AlsaFragrance was founded with a vision to bring luxury fragrances to everyone" },
    { year: "2019", event: "Launched our first signature collection featuring 12 exclusive scents" },
    { year: "2020", event: "Expanded into traditional attars and alcohol-free fragrances" },
    { year: "2021", event: "Reached 10,000 satisfied customers worldwide" },
    { year: "2022", event: "Introduced our tester collection for risk-free fragrance discovery" },
    { year: "2023", event: "Opened our flagship boutique and launched premium limited editions" },
    { year: "2024", event: "Celebrating 6 years of excellence with over 50,000 happy customers" },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <motion.section
        className="relative h-[50vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/alsa-fragrance-about-us-luxury-perfume-boutique-el.jpg')" }}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-[family-name:var(--font-playfair)] text-balance"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Our Story
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Crafting exceptional fragrances that define elegance and luxury since 2018
            </motion.p>
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-16">
        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 font-[family-name:var(--font-playfair)]">
              Welcome to AlsaFragrance
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2018, AlsaFragrance began as a passion project to bring the world's finest fragrances to
                discerning customers who appreciate quality and authenticity. What started as a small collection of
                carefully curated scents has grown into a comprehensive fragrance house offering everything from
                contemporary perfumes to traditional attars.
              </p>
              <p>
                Our journey is rooted in the belief that fragrance is more than just a scent – it's a form of
                self-expression, a memory maker, and a confidence booster. Each product in our collection is selected or
                crafted with meticulous attention to detail, ensuring that every bottle tells a unique story.
              </p>
              <p>
                Today, we're proud to serve customers worldwide, offering an extensive range of premium fragrances for
                men and women, traditional alcohol-free attars, and convenient tester sizes that allow you to discover
                your perfect scent without commitment.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To make luxury fragrances accessible to everyone while maintaining the highest standards of quality,
                  authenticity, and customer service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To become the world's most trusted destination for premium fragrances, known for our exceptional
                  quality, diverse selection, and personalized customer experience.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Values Section */}
        <section className="mb-16">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-playfair)]">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-playfair)]">Our Journey</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Key milestones in our fragrance story</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20" />

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    className="relative"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div
                      className={`flex items-center gap-6 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                    >
                      <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} hidden md:block`}>
                        {index % 2 === 0 && (
                          <Card className="inline-block">
                            <CardContent className="p-4">
                              <p className="text-muted-foreground">{milestone.event}</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <Badge variant="outline" className="bg-background font-bold">
                            {milestone.year}
                          </Badge>
                        </div>
                      </div>

                      <div className={`flex-1 ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                        <Card className="inline-block md:hidden">
                          <CardContent className="p-4">
                            <p className="text-muted-foreground">{milestone.event}</p>
                          </CardContent>
                        </Card>
                        {index % 2 !== 0 && (
                          <Card className="hidden md:inline-block">
                            <CardContent className="p-4">
                              <p className="text-muted-foreground">{milestone.event}</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <motion.section
          className="bg-card/30 rounded-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                <CounterAnimation end={50000} suffix="+" />
              </div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                <CounterAnimation end={200} suffix="+" />
              </div>
              <p className="text-muted-foreground">Premium Fragrances</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                <CounterAnimation end={6} />
              </div>
              <p className="text-muted-foreground">Years of Excellence</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                <CounterAnimation end={99} suffix="%" />
              </div>
              <p className="text-muted-foreground">Customer Satisfaction</p>
            </div>
          </div>
        </motion.section>
      </div>

      <Footer />
    </main>
  )
}
