"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-provider"
import { useMemo } from "react"

export function FragranceNotes() {
  const { t } = useLanguage()
  
  const fragranceNotes = useMemo(() => [
    {
      category: t.components.fragranceNotes.topNotes,
      description: t.components.fragranceNotes.topNotesDesc,
      notes: ["Bergamot", "Lemon", "Pink Pepper", "Cardamom"],
      color: "from-primary to-primary/80",
      image: "/citrus-bergamot-lemon-fresh-ingredients-perfume-to.jpg",
    },
    {
      category: t.components.fragranceNotes.heartNotes,
      description: t.components.fragranceNotes.heartNotesDesc,
      notes: ["Rose", "Jasmine", "Lavender", "Geranium"],
      color: "from-primary/80 to-primary/60",
      image: "/rose-jasmine-flowers-perfume-heart-notes-floral-bo.jpg",
    },
    {
      category: t.components.fragranceNotes.baseNotes,
      description: t.components.fragranceNotes.baseNotesDesc,
      notes: ["Sandalwood", "Vanilla", "Musk", "Amber"],
      color: "from-primary/60 to-primary/40",
      image: "/sandalwood-vanilla-amber-warm-ingredients-perfume-.jpg",
    },
  ], [t])
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
            {t.components.fragranceNotes.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.components.fragranceNotes.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {fragranceNotes.map((note, index) => (
            <motion.div
              key={note.category}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary/10"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={note.image || "/placeholder.svg"}
                  alt={note.category}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div
                  className={`absolute top-4 right-4 w-14 h-14 rounded-full bg-gradient-to-r ${note.color} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 font-[family-name:var(--font-playfair)] text-primary">
                  {note.category}
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">{note.description}</p>

                {/* Notes Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {note.notes.map((fragrance, idx) => (
                    <motion.div
                      key={fragrance}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * idx + 0.5 }}
                      className="flex items-center space-x-2 bg-primary/5 rounded-lg px-3 py-2 hover:bg-primary/10 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm font-medium">{fragrance}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center max-w-3xl mx-auto"
        >
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-primary/10">
            <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-playfair)]">{t.components.fragranceNotes.pyramidTitle}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t.components.fragranceNotes.pyramidDescription}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
