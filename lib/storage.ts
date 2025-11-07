import { BoardState, Card, Column } from './types'

const STORAGE_KEY = 'kanban_board_state'

const defaultColumns: Column[] = [
  { id: 'todo', title: 'TODO', order: 0, createdAt: Date.now() },
  { id: 'in-progress', title: 'In Progress', order: 1, createdAt: Date.now() },
  { id: 'completed', title: 'Completed', order: 2, createdAt: Date.now() },
]

const getInitialState = (): BoardState => ({
  columns: defaultColumns,
  cards: [],
})

export const loadBoardState = (): BoardState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return getInitialState()
    const parsed = JSON.parse(stored)
    return parsed
  } catch (error) {
    console.error('Failed to load board state:', error)
    return getInitialState()
  }
}

export const saveBoardState = (state: BoardState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save board state:', error)
  }
}

export const addCard = (state: BoardState, columnId: string, title: string, description: string = ''): BoardState => {
  const newCard: Card = {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    columnId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  const newState = {
    ...state,
    cards: [...state.cards, newCard],
  }
  saveBoardState(newState)
  return newState
}

export const updateCard = (state: BoardState, cardId: string, title: string, description: string): BoardState => {
  const newState = {
    ...state,
    cards: state.cards.map(card =>
      card.id === cardId
        ? { ...card, title, description, updatedAt: Date.now() }
        : card
    ),
  }
  saveBoardState(newState)
  return newState
}

export const deleteCard = (state: BoardState, cardId: string): BoardState => {
  const newState = {
    ...state,
    cards: state.cards.filter(card => card.id !== cardId),
  }
  saveBoardState(newState)
  return newState
}

export const moveCard = (state: BoardState, cardId: string, newColumnId: string): BoardState => {
  const newState = {
    ...state,
    cards: state.cards.map(card =>
      card.id === cardId
        ? { ...card, columnId: newColumnId, updatedAt: Date.now() }
        : card
    ),
  }
  saveBoardState(newState)
  return newState
}

export const addColumn = (state: BoardState, title: string): BoardState => {
  const maxOrder = Math.max(...state.columns.map(col => col.order), -1)
  const newColumn: Column = {
    id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    order: maxOrder + 1,
    createdAt: Date.now(),
  }

  const newState = {
    ...state,
    columns: [...state.columns, newColumn],
  }
  saveBoardState(newState)
  return newState
}

export const deleteColumn = (state: BoardState, columnId: string): BoardState => {
  const newState = {
    ...state,
    columns: state.columns.filter(col => col.id !== columnId),
    cards: state.cards.filter(card => card.columnId !== columnId),
  }
  saveBoardState(newState)
  return newState
}

export const reorderColumns = (state: BoardState, columns: Column[]): BoardState => {
  const newState = {
    ...state,
    columns: columns.sort((a, b) => a.order - b.order),
  }
  saveBoardState(newState)
  return newState
}
