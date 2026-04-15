'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const CHARS = "0123456789ABCDEF";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoverState, setHoverState] = useState<'none' | 'clickable'>('none');
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth out the follow for the orbital HUD
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const [hexString, setHexString] = useState("0x0000");

  useEffect(() => {
    // Generate random hex for the orbital decryptor
    const interval = setInterval(() => {
      if (hoverState === 'none') {
        let str = "0x";
        for (let i = 0; i < 4; i++) {
          str += CHARS[Math.floor(Math.random() * 16)];
        }
        setHexString(str);
      } else {
        setHexString("VERIFIED");
      }
    }, 80);
    return () => clearInterval(interval);
  }, [hoverState]);
  
  useEffect(() => {
    // Inject global style to hide default hardware cursor
    const style = document.createElement('style');
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isClickable = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' || 
        target.closest('a') !== null || 
        target.closest('button') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';
        
      if (isClickable) {
        setHoverState('clickable');
      } else {
        setHoverState('none');
      }
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('mouseover', updateHoverState, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', updateHoverState);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [mouseX, mouseY, isVisible, hoverState]);

  if (!isVisible) return null;

  return (
    <>
      {/* Center core precision dot */}
      <motion.div
        className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full z-[9999] pointer-events-none transition-colors duration-200 ${hoverState !== 'none' ? 'bg-green-400' : 'bg-indigo-400'}`}
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      
      {/* Cryptographic ZK Tracker HUD */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none flex flex-col items-center justify-center mix-blend-screen"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {/* Reticle / Access Brackets */}
        <motion.div
          initial={false}
          animate={{
            width: hoverState !== 'none' ? 90 : 32,
            height: hoverState !== 'none' ? 24 : 32,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="relative flex items-center justify-center"
        >
          {/* Top Left Bracket */}
          <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-colors duration-200 ${hoverState !== 'none' ? 'border-green-500' : 'border-indigo-500/50'}`} />
          {/* Top Right Bracket */}
          <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 transition-colors duration-200 ${hoverState !== 'none' ? 'border-green-500' : 'border-indigo-500/50'}`} />
          {/* Bottom Left Bracket */}
          <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 transition-colors duration-200 ${hoverState !== 'none' ? 'border-green-500' : 'border-indigo-500/50'}`} />
          {/* Bottom Right Bracket */}
          <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 transition-colors duration-200 ${hoverState !== 'none' ? 'border-green-500' : 'border-indigo-500/50'}`} />

          {/* Dynamic Hex / Verification Text */}
          <motion.div 
            className={`font-mono text-[9px] tracking-widest font-black whitespace-nowrap absolute transition-colors duration-200 ${hoverState !== 'none' ? 'text-green-400' : 'text-indigo-400/80 -bottom-6'}`}
            animate={{
              y: hoverState !== 'none' ? 0 : 5,
              opacity: 1,
              scale: hoverState !== 'none' ? 1.1 : 1
            }}
          >
            {hexString}
          </motion.div>
        </motion.div>

        {/* Orbiting Ring (Data Encryption Mesh) - hides on hover */}
        <AnimatePresence>
          {hoverState === 'none' && (
            <motion.svg
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1, rotate: 360 }}
              exit={{ opacity: 0, scale: 0.8, rotate: -45 }}
              transition={{ rotate: { duration: 6, ease: "linear", repeat: Infinity }, opacity: { duration: 0.2 } }}
              className="absolute w-16 h-16 text-indigo-400"
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 20 50 10" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="30 10 5 15" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
