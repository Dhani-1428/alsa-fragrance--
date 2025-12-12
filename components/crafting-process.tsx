"use client"

import { motion } from "framer-motion"
import { Droplet, Sparkles, FlaskConical, Clock, CheckCircle, Package } from "lucide-react"
import { useLanguage } from "@/contexts/language-provider"
import { useMemo } from "react"

export function CraftingProcess() {
  const { t } = useLanguage()
  
  const processSteps = useMemo(() => [
    {
      step: "01",
      title: t.components.craftingProcess.step1Title,
      description: t.components.craftingProcess.step1Desc,
      icon: Droplet,
      image: "/luxury-perfume-ingredients-roses-and-flowers.jpg",
    },
    {
      step: "02",
      title: t.components.craftingProcess.step2Title,
      description: t.components.craftingProcess.step2Desc,
      icon: FlaskConical,
      image: "/perfume-distillation-equipment-and-essential-oils.jpg",
    },
    {
      step: "03",
      title: t.components.craftingProcess.step3Title,
      description: t.components.craftingProcess.step3Desc,
      icon: Sparkles,
      image: "/perfumer-blending-fragrances-in-laboratory.jpg",
    },
    {
      step: "04",
      title: t.components.craftingProcess.step4Title,
      description: t.components.craftingProcess.step4Desc,
      icon: Clock,
      image: "/perfume-aging-in-glass-bottles-in-cellar.jpg",
    },
    {
      step: "05",
      title: t.components.craftingProcess.step5Title,
      description: t.components.craftingProcess.step5Desc,
      icon: CheckCircle,
      image: "/perfume-quality-testing-laboratory-equipment.jpg",
    },
    {
      step: "06",
      title: t.components.craftingProcess.step6Title,
      description: t.components.craftingProcess.step6Desc,
      icon: Package,
      image: "/luxury-perfume-bottles-being-packaged-in-golden-bo.jpg",
    },
  ], [t])
  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="relative h-80 rounded-2xl overflow-hidden mb-8 shadow-2xl">
            <img
              src="/perfume-making-process-artisan-crafting-luxury-fra.jpg"
              alt="The Art of Perfume Making"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-12">
              <div className="max-w-3xl px-6">
                <motion.h2
                  className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-playfair)] text-white"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {t.components.craftingProcess.title}
                </motion.h2>
                <motion.p
                  className="text-white/90 text-lg leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {t.components.craftingProcess.description}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-card rounded-xl overflow-hidden shadow-lg border hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={step.image || "/placeholder.svg"} alt={step.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="bg-primary/90 backdrop-blur-sm p-3 rounded-full">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-bold text-white font-mono">{step.step}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 font-[family-name:var(--font-playfair)] text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
