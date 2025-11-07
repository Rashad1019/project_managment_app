'use client'

import React, { useState, useEffect } from 'react'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { motion, AnimatePresence } from 'framer-motion'
import Column from './Column'
import AddCardModal from './AddCardModal'
import CardDetailModal from './CardDetailModal'
import AddColumnModal from './AddColumnModal'
import ThemeToggle from './ThemeToggle'
import { BoardState, Card as CardType } from '@/lib/types'
import {
  loadBoardState,
  addCard,
  updateCard,
  deleteCard,
  moveCard,
  addColumn,
  deleteColumn,
} from '@/lib/storage'

export default function KanbanBoard() {
  const [boardState, setBoardState] = useState<BoardState | null>(null)
  const [addCardModalOpen, setAddCardModalOpen] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState<string>('')
  const [cardDetailModalOpen, setCardDetailModalOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
  const [addColumnModalOpen, setAddColumnModalOpen] = useState(false)
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null)

  // Initialize board state from localStorage
  useEffect(() => {
    const state = loadBoardState()
    setBoardState(state)
  }, [])

  // Setup sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleAddCardClick = (columnId: string) => {
    setSelectedColumnId(columnId)
    setAddCardModalOpen(true)
  }

  const handleAddCard = (title: string, description: string) => {
    if (boardState) {
      const newState = addCard(boardState, selectedColumnId, title, description)
      setBoardState(newState)
    }
  }

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card)
    setCardDetailModalOpen(true)
  }

  const handleUpdateCard = (title: string, description: string) => {
    if (boardState && selectedCard) {
      const newState = updateCard(boardState, selectedCard.id, title, description)
      setBoardState(newState)
      setSelectedCard(null)
    }
  }

  const handleDeleteCard = (cardId: string) => {
    if (boardState) {
      const newState = deleteCard(boardState, cardId)
      setBoardState(newState)
      if (selectedCard?.id === cardId) {
        setSelectedCard(null)
      }
    }
  }

  const handleAddColumn = (title: string) => {
    if (boardState) {
      const newState = addColumn(boardState, title)
      setBoardState(newState)
    }
  }

  const handleDeleteColumn = (columnId: string) => {
    if (boardState) {
      const newState = deleteColumn(boardState, columnId)
      setBoardState(newState)
    }
  }

  const handleDragStart = () => {
    // Drag start handling
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    if (over) {
      setDragOverColumnId(over.id as string)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setDragOverColumnId(null)

    const { active, over } = event
    if (!boardState || !over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Check if we're moving a card to a different column
    const activeCard = boardState.cards.find(c => c.id === activeId)
    if (activeCard && overId !== activeCard.columnId) {
      const newState = moveCard(boardState, activeId, overId)
      setBoardState(newState)
    }
  }

  if (!boardState) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          animate={{ scale: [0.8, 1] }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600 dark:text-gray-300 font-semibold">Loading your board...</p>
        </motion.div>
      </div>
    )
  }

  const sortedColumns = [...boardState.columns].sort((a, b) => a.order - b.order)
  const columnIds = sortedColumns.map(col => col.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Project Board
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Organize your tasks with drag and drop
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAddColumnModalOpen(true)}
                className="
                  px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary
                  text-white font-semibold shadow-lg hover:shadow-xl
                  transition-all duration-200
                "
              >
                + Add Column
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6"
        >
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex gap-6 overflow-x-auto pb-4">
              <AnimatePresence>
                {sortedColumns.map(column => {
                  const columnCards = boardState.cards
                    .filter(card => card.columnId === column.id)
                    .sort((a, b) => a.id.localeCompare(b.id))

                  return (
                    <Column
                      key={column.id}
                      column={column}
                      cards={columnCards}
                      isDraggingOver={dragOverColumnId === column.id}
                      onAddCard={handleAddCardClick}
                      onCardClick={handleCardClick}
                      onCardDelete={handleDeleteCard}
                      onDeleteColumn={handleDeleteColumn}
                    />
                  )
                })}
              </AnimatePresence>
            </div>
          </SortableContext>
        </motion.div>
      </DndContext>

      {/* Modals */}
      <AddCardModal
        isOpen={addCardModalOpen}
        columnId={selectedColumnId}
        onClose={() => setAddCardModalOpen(false)}
        onAdd={handleAddCard}
      />

      <CardDetailModal
        isOpen={cardDetailModalOpen}
        card={selectedCard}
        onClose={() => setCardDetailModalOpen(false)}
        onUpdate={handleUpdateCard}
        onDelete={() => selectedCard && handleDeleteCard(selectedCard.id)}
      />

      <AddColumnModal
        isOpen={addColumnModalOpen}
        onClose={() => setAddColumnModalOpen(false)}
        onAdd={handleAddColumn}
      />
    </div>
  )
}
