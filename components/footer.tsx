"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-provider"

export function Footer() {
  const { t } = useLanguage()
  
  const footerLinks = {
    shop: [
      { name: t.footer.allProducts, href: "/shop" },
      { name: t.footer.womensFragrances, href: "/women" },
      { name: t.footer.mensFragrances, href: "/men" },
      { name: t.footer.attars, href: "/attars" },
      { name: t.footer.testers, href: "/testers" },
      { name: t.footer.newArrivals, href: "/new-arrivals" },
      { name: t.footer.limitedEdition, href: "/limited-edition" },
    ],
    company: [
      { name: t.footer.aboutUs, href: "/about" },
      { name: t.footer.contact, href: "/contact" },
      { name: t.footer.careers, href: "/careers" },
      { name: t.footer.press, href: "/press" },
      { name: t.footer.blog, href: "/blog" },
    ],
    support: [
      { name: t.footer.faq, href: "/faq" },
      { name: t.footer.shippingInfo, href: "/shipping" },
      { name: t.footer.returns, href: "/returns" },
      { name: t.footer.sizeGuide, href: "/size-guide" },
      { name: t.footer.trackOrder, href: "/track" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ]

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-background border-t"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-16">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4 font-[family-name:var(--font-playfair)] text-primary">
              {t.footer.stayInTheScent}
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              {t.footer.subscribeDescription}
            </p>
            <motion.div className="flex gap-2" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Input placeholder={t.footer.enterEmail} type="email" className="border-primary/20 focus:border-primary" />
              <Button className="bg-primary hover:bg-primary/90">
                <Mail className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <Separator className="mb-16" />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="relative h-16 w-16">
                <Image src="/alsa-logo.png" alt="Alsa Fragrance" fill className="object-contain" />
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {t.footer.companyDescription}
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Link
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-6 text-primary font-[family-name:var(--font-playfair)] text-xl">{t.footer.shop}</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                >
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-6 text-primary font-[family-name:var(--font-playfair)] text-xl">{t.footer.company}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                >
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-6 text-primary font-[family-name:var(--font-playfair)] text-xl">
              {t.footer.contactUs}
            </h4>
            <div className="space-y-4">
              <motion.a
                href="tel:+351920062535"
                className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>+351 920062535</span>
              </motion.a>
              <motion.a
                href="mailto:fragrancealsa@gmail.com"
                className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>fragrancealsa@gmail.com</span>
              </motion.a>
              <motion.div
                className="flex items-start gap-3 text-sm text-muted-foreground"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Avenida doutor Miguel bombarda Loja n'47 queluz 2745-172</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center text-muted-foreground gap-4">
            <p>{t.footer.copyright}</p>
            <div className="flex items-center gap-4">
              <span className="text-sm">{t.footer.weAccept}</span>
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="h-8 px-3 bg-primary/10 border border-primary/20 rounded flex items-center justify-center"
                >
                  <span className="text-xs font-semibold text-primary">VISA</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="h-8 px-3 bg-primary/10 border border-primary/20 rounded flex items-center justify-center"
                >
                  <span className="text-xs font-semibold text-primary">Mastercard</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="h-8 px-3 bg-primary/10 border border-primary/20 rounded flex items-center justify-center"
                >
                  <span className="text-xs font-semibold text-primary">MBway</span>
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center pt-4 border-t border-border/50"
          >
            <p className="text-sm text-muted-foreground">
              {t.footer.designedBy}{" "}
              <a 
                href="https://bonusitsolutions.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:text-primary/80 transition-colors underline"
              >
                Bonus IT Solutions
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  )
}
