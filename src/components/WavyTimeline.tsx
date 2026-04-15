"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function WavyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll within this specific container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll mapping
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // The SVG viewBox is 0 0 100 100.
  // Nodes are at Y percentages: 20%, 45%, 70%, 90%
  const nodes = [
    { id: 1, label: "The Chaos", desc: "Data scattered across walled gardens.", x: 20, y: 15 },
    { id: 2, label: "The Shift", desc: "Identity mapped to the Algorand Ledger.", x: 80, y: 40 },
    { id: 3, label: "The Cryptography", desc: "Data hashed out. Access programmed.", x: 20, y: 65 },
    { id: 4, label: "The Reality", desc: "Zero-knowledge proofs in your Vault.", x: 80, y: 90 },
  ];

  // Precise bezier curve path mapping perfectly to the 100x100 grid.
  const svgPath = `
    M 50,0 
    C 50,8  20,8  20,15 
    C 20,30  80,30  80,40 
    C 80,55  20,55  20,65 
    C 20,80  80,80  80,90 
    C 80,95  50,95  50,100
  `.trim().replace(/\s+/g, ' ');

  // SVG total length is typically 1 in standard coordinates if pathLength mapping is 1. Wait, Framer motion pathLength uses fractions 0 to 1. 

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-transparent">
      
      {/* Absolute SVG spanning the entire container height */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
        
        {/* Draw the timeline */}
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none" 
          className="absolute inset-0 w-full h-full opacity-40"
        >
          {/* Base dimmed path */}
          <path 
            d={svgPath}
            fill="none" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="0.2" 
            strokeDasharray="1 1"
          />
          {/* Animated active path tracking scroll */}
          <motion.path 
            d={svgPath}
            fill="none" 
            stroke="rgba(174, 48, 255, 0.8)" 
            strokeWidth="0.5" 
            style={{ 
              pathLength: smoothProgress,
              filter: "drop-shadow(0px 0px 5px rgba(174, 48, 255, 0.8))"
            }}
          />
        </svg>

        {/* Nodes overlay mapped perfectly to SVG viewBox coordinates */}
        {nodes.map((node, i) => (
           <TimelineNode 
             key={node.id} 
             node={node} 
             index={i} 
             progress={scrollYProgress} 
           />
        ))}

      </div>
    </div>
  );
}

// Subcomponent for each node and its pop-out box
function TimelineNode({ node, index, progress }: any) {
  // We trigger the pop-out when scroll progress passes the node's Y-percentage.
  const triggerThreshold = (node.y - 10) / 100; // Trigger slightly before the dot arrives

  // Animation maps based on scroll progress
  // Opacity: fades in around threshold
  const nodeOpacity = useTransform(
    progress,
    [triggerThreshold - 0.05, triggerThreshold + 0.05],
    [0.3, 1]
  );
  
  // Transform for the 3D Pop Out Effect requested in the sketch
  // The sketch shows overlapping sheets flipping into view
  const rotateX = useTransform(
    progress,
    [triggerThreshold - 0.05, triggerThreshold + 0.05],
    [60, 0]
  );
  
  const popScale = useTransform(
    progress,
    [triggerThreshold - 0.05, triggerThreshold + 0.05],
    [0.8, 1]
  );

  return (
    <div 
      className="absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
      style={{
        top: `${node.y}%`,
        left: `${node.x}%`
      }}
    >
      {/* The Map Node / Circle */}
      <motion.div 
        style={{ opacity: nodeOpacity }}
        className="relative z-20 w-12 h-12 rounded-full border-2 border-purple-500 bg-black flex items-center justify-center shadow-[0_0_20px_rgba(174,48,255,0.4)] pointer-events-auto"
      >
        <span className="text-white font-black text-xl">{node.id}</span>
      </motion.div>

      {/* The "Pop Out" Content Box - Positioned adjacent based on side */}
      <motion.div 
        style={{ 
           opacity: nodeOpacity, 
           rotateX: rotateX,
           scale: popScale,
           transformPerspective: 1000
        }}
        className={`absolute top-16 w-72 md:w-96 p-6 glass-panel-premium border border-purple-500/30 pointer-events-auto shadow-2xl ${node.x < 50 ? 'left-[-40px] origin-top-left' : 'right-[-40px] origin-top-right'}`}
      >
        {/* Wireframe backing (sketch styling detail) */}
        <div className="absolute -inset-4 border border-white/5 bg-transparent rounded-3xl -z-10 rotate-3 opacity-50 backdrop-blur-sm pointer-events-none" />
        
        <h3 className="text-2xl font-bold text-white mb-2">{node.label}</h3>
        <p className="text-gray-400">{node.desc}</p>
        
        {/* Data lines purely aesthetic */}
        <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
            {[1,2,3].map(i => (
                <div key={i} className="h-1 bg-white/10 rounded-full flex-grow" />
            ))}
        </div>
      </motion.div>
    </div>
  );
}
