export interface Card {
  name: string
  strength: number
}

export interface PlayCard extends Card {
  id: string
}
