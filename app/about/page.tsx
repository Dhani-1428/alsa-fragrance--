"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Heart, Leaf, Users } from "lucide-react"
import { CounterAnimation } from "@/components/counter-animation"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-provider"

export default function AboutPage() {
  const { t } = useLanguage()
  
  const values = [
    {
      icon: Heart,
      title: t.about.passionForFragrance,
      description: t.about.passionForFragranceDescription,
    },
    {
      icon: Award,
      title: t.about.premiumQuality,
      description: t.about.premiumQualityDescription,
    },
    {
      icon: Leaf,
      title: t.about.naturalIngredients,
      description: t.about.naturalIngredientsDescription,
    },
    {
      icon: Users,
      title: t.about.customerFirst,
      description: t.about.customerFirstDescription,
    },
  ]

  const milestones = [
    { year: "2018", event: t.about.milestone2018 },
    { year: "2019", event: t.about.milestone2019 },
    { year: "2020", event: t.about.milestone2020 },
    { year: "2021", event: t.about.milestone2021 },
    { year: "2022", event: t.about.milestone2022 },
    { year: "2023", event: t.about.milestone2023 },
    { year: "2024", event: t.about.milestone2024 },
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
              {t.about.ourStory}
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {t.about.ourStoryDescription}
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
              {t.about.welcomeToAlsa}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{t.about.aboutParagraph1}</p>
              <p>{t.about.aboutParagraph2}</p>
              <p>{t.about.aboutParagraph3}</p>
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
                <h3 className="font-semibold mb-4">{t.about.ourMission}</h3>
                <p className="text-muted-foreground">
                  {t.about.ourMissionDescription}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{t.about.ourVision}</h3>
                <p className="text-muted-foreground">
                  {t.about.ourVisionDescription}
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
            <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-playfair)]">{t.about.ourValues}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.about.ourValuesDescription}
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
            <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-playfair)]">{t.about.ourJourney}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.about.ourJourneyDescription}</p>
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
              <p className="text-muted-foreground">{t.about.happyCustomers}</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                <CounterAnimation end={200} suffix="+" />
              </div>
              <p className="text-muted-foreground">{t.about.premiumFragrances}</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                <CounterAnimation end={6} />
              </div>
              <p className="text-muted-foreground">{t.about.yearsOfExcellence}</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                <CounterAnimation end={99} suffix="%" />
              </div>
              <p className="text-muted-foreground">{t.about.customerSatisfaction}</p>
            </div>
          </div>
        </motion.section>
      </div>

      <Footer />
    </main>
  )
}
