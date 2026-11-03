import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./splash.css"
import gsap from "gsap";

export default function SplashScreen({ onFinish }) {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {

    gsap.to(".back-text tspan", {
      strokeDashoffset: "0",
      duration: 3,
      stagger: 0.1,
      delay: 1
    });

  }, []);
  useEffect(() => {
    // Shorter splash screen duration (1.8s total) to transition quickly
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); // Wait for exit animation to complete before calling onFinish
    }, 4000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#080808] flex items-center justify-center overflow-hidden"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-600/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center ">
            {/* Logo Mark */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.1 }}
              className="w-22 h-22 rounded-2xl bg-[#0F141E] flex items-center justify-center border border-[#212732] mb-10 overflow-hidden"
            >
              <motion.img initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 4 }} src="/icon.png" alt="" />
            </motion.div>

            {/* Wordmark */}
            {/* <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-2xl font-bold tracking-tight text-white mb-2"
            >
              NoteLM
            </motion.div> */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="splash-screen"
            >
              <svg viewBox="0 0 600 100">
                <defs>
                  <mask id="text-mask">
                    <text
                      y="50%"
                      x="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                    >
                      <tspan>N</tspan>
                      <tspan>o</tspan>
                      <tspan>t</tspan>
                      <tspan>e</tspan>
                      <tspan>l</tspan>
                      <tspan>m</tspan>
                    </text>
                    {/* <!-- <text y="50%" x="50%" text-anchor="middle" dominantBaseline="middle" fill="white">OUTLINE</text> --> */}
                  </mask>
                </defs>

                <text
                  y="50%"
                  x="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="back-text"
                >
                  <tspan>N</tspan>
                  <tspan>o</tspan>
                  <tspan>t</tspan>
                  <tspan>e</tspan>
                  <tspan>l</tspan>
                  <tspan>m</tspan>
                </text>

                <rect
                  x="0"
                  y="0"
                  width="600"
                  fill="white"
                  className="fill-rect"
                  mask="url(#text-mask)"
                ></rect>
              </svg>
            </motion.div>

            {/* Subtitle / Loading text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center gap-2 mt-4 translate-y-50"
            >
              <div className="w-4 h-4 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
              <span className="text-xs font-medium text-[#64748B] tracking-widest uppercase ">
                Initializing Workspace
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}