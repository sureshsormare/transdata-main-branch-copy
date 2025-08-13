"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedGradientTextProps {
  children: ReactNode
  className?: string
  gradient?: string
  delay?: number
  duration?: number
}

export function AnimatedGradientText({ 
  children, 
  className = "", 
  gradient = "from-blue-600 via-purple-600 to-cyan-500",
  delay = 0,
  duration = 1
}: AnimatedGradientTextProps) {
  return (
    <motion.span 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay }}
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}
    >
      {children}
    </motion.span>
  )
}

interface InteractiveCardProps {
  children: ReactNode
  className?: string
  hoverScale?: number
  glowColor?: string
  index?: number
}

export function InteractiveCard({ 
  children, 
  className = "", 
  hoverScale = 1.03,
  glowColor = "blue-500",
  index = 0
}: InteractiveCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: hoverScale }}
      className={`
        transition-all duration-500 
        hover:shadow-2xl hover:shadow-${glowColor}/20 
        border-0 bg-white/80 backdrop-blur-sm h-full 
        group-hover:bg-white/95 relative overflow-hidden 
        cursor-pointer group
        ${className}
      `}
    >
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${glowColor} via-purple-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
      />
      {children}
    </motion.div>
  )
}

interface AnimatedIconProps {
  children: ReactNode
  className?: string
  animation?: "rotate" | "scale" | "pulse"
  gradient?: string
}

export function AnimatedIcon({ 
  children, 
  className = "", 
  animation = "rotate",
  gradient = "from-blue-500 to-cyan-500"
}: AnimatedIconProps) {
  const getAnimation = () => {
    switch (animation) {
      case "rotate":
        return { rotate: 360, scale: 1.1 }
      case "scale":
        return { scale: 1.2 }
      case "pulse":
        return { scale: [1, 1.1, 1] }
      default:
        return { rotate: 360, scale: 1.1 }
    }
  }

  return (
    <motion.div 
      whileHover={getAnimation()}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={`
        bg-gradient-to-br ${gradient} rounded-2xl 
        flex items-center justify-center 
        group-hover:shadow-lg group-hover:shadow-blue-500/30 
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

interface PulsingBadgeProps {
  children: ReactNode
  className?: string
  gradient?: string
}

export function PulsingBadge({ 
  children, 
  className = "", 
  gradient = "from-blue-500 via-purple-500 to-pink-500"
}: PulsingBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`inline-block px-6 py-3 bg-gradient-to-r ${gradient} text-white rounded-full text-sm font-bold shadow-lg ${className}`}
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

interface CountUpNumberProps {
  value: string
  className?: string
  gradient?: string
  duration?: number
  delay?: number
}

export function CountUpNumber({ 
  value, 
  className = "", 
  gradient = "from-blue-300 via-cyan-300 to-blue-400",
  duration = 2,
  delay = 0
}: CountUpNumberProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay }}
      className={`font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: delay + 0.5 }}
      >
        {value}
      </motion.span>
    </motion.div>
  )
}

interface GlowingButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  gradient?: string
  size?: "sm" | "md" | "lg"
}

export function GlowingButton({ 
  children, 
  onClick, 
  className = "", 
  gradient = "from-blue-600 via-purple-600 to-indigo-600",
  size = "md"
}: GlowingButtonProps) {
  const sizeClasses = {
    sm: "px-6 py-2 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-10 py-4 text-lg"
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        bg-gradient-to-r ${gradient} 
        hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 
        text-white font-semibold rounded-xl 
        transition-all duration-300 shadow-lg hover:shadow-xl
        relative overflow-hidden group
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

export default {
  AnimatedGradientText,
  InteractiveCard,
  AnimatedIcon,
  PulsingBadge,
  CountUpNumber,
  GlowingButton
}