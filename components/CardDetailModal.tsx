'use client'

import React, { useState, useEffect } from 'react'
import { Card as CardType } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

interface CardDetailModalProps {
  isOpen: boolean
  card: CardType | null
  onClose: () => void
  onUpdate: (title: string, description: string) => void
  onDelete: () => void
}

export default function CardDetailModal({
  isOpen,
  card,
  onClose,
  onUpdate,
  onDelete,
}: CardDetailModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (card) {
      setTitle(card.title)
      setDescription(card.description)
      setIsEditing(false)
      setHasChanges(false)
    }
  }, [card, isOpen])

  const handleSave = () => {
    if (card && title.trim()) {
      onUpdate(title, description)
      setIsEditing(false)
      setHasChanges(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (hasChanges) {
        const confirm = window.confirm('You have unsaved changes. Are you sure you want to close?')
        if (confirm) onClose()
      } else {
        onClose()
      }
    }
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    setHasChanges(value !== card?.title || description !== card?.description)
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    setHasChanges(title !== card?.title || value !== card?.description)
  }

  return (
    <AnimatePresence>
      {isOpen && card && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4 flex items-center justify-between sticky top-0">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isEditing ? 'Edit Card' : 'Card Details'}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {isEditing ? 'Make changes to your task' : 'View and manage your task'}
                </p>
              </div>
              <motion.button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="
                      w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none
                      transition-all duration-200 text-gray-900 font-semibold
                      focus:ring-4 focus:ring-primary/10
                    "
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-semibold">
                    {title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                {isEditing ? (
                  <textarea
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    rows={6}
                    className="
                      w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none
                      transition-all duration-200 text-gray-900 resize-none
                      focus:ring-4 focus:ring-primary/10
                    "
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg min-h-24">
                    {description ? (
                      <p className="text-gray-700 whitespace-pre-wrap break-words">
                        {description}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">No notes added yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Created</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(card.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Updated</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(card.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {isEditing ? (
                  <>
                    <motion.button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        setTitle(card.title)
                        setDescription(card.description)
                        setHasChanges(false)
                      }}
                      className="
                        flex-1 px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900
                        font-semibold transition-all duration-200
                      "
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleSave}
                      disabled={!hasChanges || !title.trim()}
                      className="
                        flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary
                        text-white font-semibold transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg
                      "
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Save Changes
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="
                        flex-1 px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary
                        font-semibold transition-all duration-200
                      "
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this card?')) {
                          onDelete()
                          onClose()
                        }
                      }}
                      className="
                        flex-1 px-4 py-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive
                        font-semibold transition-all duration-200
                      "
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Delete
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={onClose}
                      className="
                        flex-1 px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900
                        font-semibold transition-all duration-200
                      "
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Close
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
