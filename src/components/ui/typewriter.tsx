'use client'

import { motion, Variants } from 'framer-motion'
import { useEffect, useState } from 'react'

import { cn } from '~/utils'

interface TypewriterProps {
  className?: string
  cursorAnimationVariants?: {
    animate: Variants['animate']
    initial: Variants['initial']
  }
  cursorChar?: React.ReactNode | string
  cursorClassName?: string
  deleteSpeed?: number
  hideCursorOnType?: boolean
  initialDelay?: number
  loop?: boolean
  showCursor?: boolean
  speed?: number
  text: string | string[]
  waitTime?: number
}

const Typewriter = ({
  className,
  cursorAnimationVariants = {
    animate: {
      opacity: 1,
      transition: {
        duration: 0.01,
        repeat: Infinity,
        repeatDelay: 0.4,
        repeatType: 'reverse',
      },
    },
    initial: { opacity: 0 },
  },
  cursorChar = '|',
  cursorClassName = 'ml-1',
  deleteSpeed = 30,
  hideCursorOnType = false,
  initialDelay = 0,
  loop = true,
  showCursor = true,
  speed = 50,
  text,
  waitTime = 2000,
}: TypewriterProps) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  const texts = Array.isArray(text) ? text : [text]

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const currentText = texts[currentTextIndex]

    const startTyping = () => {
      if (isDeleting) {
        if (displayText === '') {
          setIsDeleting(false)
          if (currentTextIndex === texts.length - 1 && !loop) {
            return
          }
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
          setCurrentIndex(0)
          timeout = setTimeout(() => {}, waitTime)
        } else {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1))
          }, deleteSpeed)
        }
      } else {
        if (currentIndex < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev + currentText[currentIndex])
            setCurrentIndex((prev) => prev + 1)
          }, speed)
        } else if (texts.length > 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true)
          }, waitTime)
        }
      }
    }

    // Apply initial delay only at the start
    if (currentIndex === 0 && !isDeleting && displayText === '') {
      timeout = setTimeout(startTyping, initialDelay)
    } else {
      startTyping()
    }

    return () => clearTimeout(timeout)
  }, [currentIndex, displayText, isDeleting, speed, deleteSpeed, waitTime, texts, currentTextIndex, loop])

  return (
    <div className={`inline whitespace-pre-wrap tracking-tight ${className}`}>
      <span>{displayText}</span>
      {showCursor && (
        <motion.span
          animate="animate"
          className={cn(
            cursorClassName,
            hideCursorOnType && (currentIndex < texts[currentTextIndex].length || isDeleting) ? 'hidden' : '',
          )}
          initial="initial"
          variants={cursorAnimationVariants}
        >
          {cursorChar}
        </motion.span>
      )}
    </div>
  )
}

export { Typewriter }
