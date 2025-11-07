'use client'

import React, { useState } from 'react'
import { Card as CardType } from '@/lib/types'
import { motion } from 'framer-motion'

interface CardProps {
  card: CardType
  isDragging?: boolean
  onClick?: () => void
  onDelete?: () => void
}

export default function Card({
  card,
  isDragging = false,
  onClick,
  onDelete,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`
        relative rounded-lg border-2 border-transparent transition-all duration-200
        ${
          isDragging
            ? 'bg-white shadow-2xl scale-105 border-primary/50'
            : 'bg-white shadow-md hover:shadow-lg border-gray-200'
        }
        ${isHovered ? 'scale-102 shadow-lg' : ''}
        cursor-grab active:cursor-grabbing
        p-4
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 cursor-pointer" onClick={onClick}>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug break-words">
            {card.title}
          </h3>
          {card.description && (
            <p className="text-xs text-gray-600 mt-2 line-clamp-2 break-words">
              {card.description}
            </p>
          )}
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.()
          }}
          className="
            flex-shrink-0 w-5 h-5 flex items-center justify-center
            rounded-full bg-red-100 hover:bg-red-200 text-red-600
            transition-colors duration-150
          "
          title="Delete card"
        >
          <span className="text-xs font-bold">×</span>
        </motion.button>
      </div>

      {/* Timestamp indicator */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Updated {formatTime(card.updatedAt)}
        </p>
      </div>
    </motion.div>
  )
}

function formatTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
