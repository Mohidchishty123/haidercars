"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { SHOWROOM_SETTINGS } from "@/data/settings";
import { MECHANICAL_EASE } from "@/components/MotionEffects";

export function WhatsAppFloat() {
  const url = `https://wa.me/${SHOWROOM_SETTINGS.whatsapp_number}?text=${encodeURIComponent(
    "Assalam-o-Alaikum Haider Cars, I would like to speak with your showroom team."
  )}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.4, ease: MECHANICAL_EASE }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 overflow-hidden rounded-[4px] border border-accent bg-accent px-4 py-3 text-xs font-bold text-accent-ink transition-colors duration-300"
    >
      <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
      <span className="relative z-10 flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-ink opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-ink" />
      </span>
      <MessageCircle className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      <span className="relative z-10 hidden font-mono uppercase tracking-wider sm:inline">
        WhatsApp Concierge
      </span>
    </motion.a>
  );
}
