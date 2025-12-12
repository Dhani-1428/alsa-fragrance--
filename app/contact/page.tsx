"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-provider"

export default function ContactPage() {
  const { t } = useLanguage()
  
  const contactInfo = [
    {
      icon: MapPin,
      title: t.contact.visitOurStore,
      details: ["Avenida doutor Miguel bombarda", "Loja n'47 queluz", "2745-172"],
    },
    {
      icon: Phone,
      title: t.contact.callUs,
      details: ["+351 920062535", t.contact.businessHoursMonFri],
    },
    {
      icon: Mail,
      title: t.contact.emailUs,
      details: ["fragrancealsa@gmail.com"],
    },
    {
      icon: Clock,
      title: t.contact.businessHours,
      details: [t.contact.businessHoursMonFri, t.contact.businessHoursSat, t.contact.businessHoursSun],
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <motion.section
        className="relative h-[70vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/contact hero img.png')" }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-[family-name:var(--font-playfair)] text-balance"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t.contact.title}
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t.contact.subtitle}
            </motion.p>
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-playfair)]">{t.contact.sendUsMessage}</h2>
            <ContactForm />
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-playfair)]">{t.contact.getInTouch}</h2>

            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <info.icon className="h-5 w-5 text-primary" />
                      {info.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
              {t.contact.faq}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.contact.faqDescription}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: t.contact.shippingTime,
                content: t.contact.shippingTimeAnswer,
              },
              {
                title: t.contact.returnPolicy,
                content: t.contact.returnPolicyAnswer,
              },
              {
                title: t.contact.authenticProducts,
                content: t.contact.authenticProductsAnswer,
              },
              {
                title: t.contact.fragranceConsultations,
                content: t.contact.fragranceConsultationsAnswer,
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
