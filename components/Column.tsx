'use client'

import React, { useState } from 'react'
import { Column as ColumnType, Card as CardType } from '@/lib/types'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import Card from './Card'
import { motion, AnimatePresence } from 'framer-motion'

interface ColumnProps {
  column: ColumnType
  cards: CardType[]
  isDraggingOver?: boolean
  onAddCard?: (columnId: string) => void
  onCardClick?: (card: CardType) => void
  onCardDelete?: (cardId: string) => void
  onDeleteColumn?: (columnId: string) => void
}

export default function Column({
  column,
  cards,
  isDraggingOver = false,
  onAddCard,
  onCardClick,
  onCardDelete,
  onDeleteColumn,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  const [isHovered, setIsHovered] = useState(false)
  const cardIds = cards.map(card => card.id)

  return (
    <motion.div
      layout
      className="flex-shrink-0 w-full sm:w-96 flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border-2 transition-all duration-300"
      style={{
        borderColor: isDraggingOver ? '#7C3AED' : '#E5E7EB',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{column.title}</h2>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold">
            {cards.length}
          </span>
        </div>

        {/* Delete Column Button */}
        {isHovered && !['todo', 'in-progress', 'completed'].includes(column.id) && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => onDeleteColumn?.(column.id)}
            className="
              flex-shrink-0 w-6 h-6 flex items-center justify-center
              rounded-full bg-red-100 hover:bg-red-200 text-red-600
              transition-colors duration-150 text-sm font-bold
            "
            title="Delete column"
          >
            ×
          </motion.button>
        )}
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 space-y-3 overflow-y-auto pr-2 rounded-lg transition-all duration-300
          ${
            isDraggingOver
              ? 'bg-purple-50/50 ring-2 ring-primary/30 ring-inset'
              : 'bg-transparent'
          }
          min-h-12
        `}
      >
        <SortableContext
          items={cardIds}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {cards.length > 0 ? (
              cards.map(card => (
                <DraggableCard
                  key={card.id}
                  card={card}
                  onCardClick={onCardClick}
                  onCardDelete={onCardDelete}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 text-gray-400 dark:text-gray-500"
              >
                <p className="text-sm">No cards yet</p>
                <p className="text-xs mt-1">Drop cards here or add new ones</p>
              </motion.div>
            )}
          </AnimatePresence>
        </SortableContext>
      </div>

      {/* Add Card Button */}
      <motion.button
        layout
        onClick={() => onAddCard?.(column.id)}
        className="
          w-full mt-4 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600
          hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary
          font-semibold text-sm transition-all duration-200
          hover:shadow-md active:scale-95
        "
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        + Add Card
      </motion.button>
    </motion.div>
  )
}

interface DraggableCardProps {
  card: CardType
  onCardClick?: (card: CardType) => void
  onCardDelete?: (cardId: string) => void
}

function DraggableCard({
  card,
  onCardClick,
  onCardDelete,
}: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: card.id,
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Card
        card={card}
        isDragging={isDragging}
        onClick={() => onCardClick?.(card)}
        onDelete={() => onCardDelete?.(card.id)}
      />
    </div>
  )
}
