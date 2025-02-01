"use client"

import { motion } from "framer-motion"
import * as React from "react"

interface RippleProps {
  children: React.ReactNode
  color?: string
  duration?: number
}

export function Ripple({ children, color = "#73ffedff", duration = 0.5 }: RippleProps) {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([])

  const addRipple = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rippleContainer = event.currentTarget.getBoundingClientRect()
    const size = rippleContainer.width > rippleContainer.height ? rippleContainer.width : rippleContainer.height
    const x = ("touches" in event ? event.touches[0].clientX : event.clientX) - rippleContainer.left - size
    const y = ("touches" in event ? event.touches[0].clientY : event.clientY) - rippleContainer.top - size
    const newRipple = {
      x,
      y,
      id: new Date().getTime(),
    }

    setRipples((prevRipples) => [...prevRipples, newRipple])
  }

  const removeRipple = () => {
    setRipples((prevRipples) => prevRipples.slice(1))
  }

  return (
    <div
      className="relative overflow-hidden z-0 rounded-xl"
      onMouseDown={addRipple}
      onTouchStart={addRipple}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{
            width: 0,
            height: 0,
            x: ripple.x,
            y: ripple.y,
            // opacity: 0.5,
          }}
          animate={{
            width: 1000,
            height: 1000,
            opacity: 0,
          }}
          transition={{
            duration: duration,
            ease: "linear",
          }}
          onAnimationComplete={removeRipple}
          style={{
            position: "absolute",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: color,
          }}
        />
      ))}
      <div className="relative overflow-hidden">
        {children}
      </div>
    </div>
  )
}

