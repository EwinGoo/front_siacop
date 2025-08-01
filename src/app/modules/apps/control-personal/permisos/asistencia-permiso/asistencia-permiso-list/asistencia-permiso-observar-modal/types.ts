export type ObservarModalProps = {
  id?: number
  show: boolean
  onClose: () => void
}

export type ObservarFormValues = {
  code: number | null
  action: 'observe'
  observacion: string
}