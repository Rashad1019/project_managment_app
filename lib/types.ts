export interface Card {
  id: string
  title: string
  description: string
  columnId: string
  createdAt: number
  updatedAt: number
}

export interface Column {
  id: string
  title: string
  order: number
  createdAt: number
}

export interface BoardState {
  columns: Column[]
  cards: Card[]
}
