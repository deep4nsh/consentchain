'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BackgroundElements() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { scrollYProgress } = useScroll();
    const yRange = useTransform(scrollYProgress, [0, 1], [0, -200]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 40,
                y: (e.clientY / window.innerHeight - 0.5) * 40,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden bg-[#0a0c10]">
            {/* Mesh Gradient Base */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow" />
            </div>

            {/* Floating Objects */}
            <motion.div 
                style={{ x: mousePosition.x, y: mousePosition.y }}
                className="absolute inset-0"
            >
                {/* Large semi-transparent circles */}
                <motion.div
                    animate={{ 
                        y: [0, -30, 0],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[15%] left-[10%] w-64 h-64 border border-white/5 rounded-[40%] backdrop-blur-[2px]"
                />
                <motion.div
                    animate={{ 
                        y: [0, 40, 0],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[20%] right-[15%] w-96 h-96 border border-white/5 rounded-[30%] backdrop-blur-[1px]"
                />
                
                {/* Modern Geometric Nodes */}
                <div className="absolute top-[40%] left-[60%] opacity-20 group">
                    <svg width="100" height="100" viewBox="0 0 100 100" className="animate-spin-slow">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-400" strokeDasharray="5 5" />
                        <rect x="30" y="30" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1" className="text-purple-400" />
                    </svg>
                </div>
            </motion.div>

            {/* Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            
            {/* Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.5)]" />
        </div>
    );
}
