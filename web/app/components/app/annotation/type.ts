export type AnnotationItemBasic = {
  message_id?: string
  question: string
  answer: string
}

export type AnnotationItem = {
  id: string
  question: string
  answer: string
  created_at: number
  hit_count: number
}
