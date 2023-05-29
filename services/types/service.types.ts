export interface CreateSpinGameDTO {
  name: string
}

export interface UpdateSpinGameDTO {
  spinGameName: string
  prizes: {
    name: string
    probability: number
  }[]
}