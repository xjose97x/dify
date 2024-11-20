import type { VisionFile } from '@/types/app'
import type { Metadata } from '@/app/components/base/chat/chat/type'

// Log type contains key:string conversation_id:string created_at:string question:string answer:string
export type Conversation = {
  id: string
  key: string
  conversationId: string
  question: string
  answer: string
  userRate: number
  adminRate: number
}

export type LogAnnotation = {
  id: string
  content: string
  account: {
    id: string
    name: string
    email: string
  }
  created_at: number
}

export type Annotation = {
  id: string
  authorName: string
  logAnnotation?: LogAnnotation
  created_at?: number
}

export type MessageContent = {
  id: string
  conversation_id: string
  query: string
  inputs: Record<string, any>
  message: { role: string; text: string; files?: VisionFile[] }[]
  message_tokens: number
  answer_tokens: number
  answer: string
  provider_response_latency: number
  created_at: number
  annotation: LogAnnotation
  annotation_hit_history: {
    annotation_id: string
    annotation_create_account: {
      id: string
      name: string
      email: string
    }
    created_at: number
  }
  feedbacks: Array<{
    rating: 'like' | 'dislike' | null
    content: string | null
    from_source?: 'admin' | 'user'
    from_end_user_id?: string
  }>
  message_files: VisionFile[]
  metadata: Metadata
  agent_thoughts: any[] // TODO
  workflow_run_id: string
  parent_message_id: string | null
}

export type ChatMessage = MessageContent

export const MessageRatings = ['like', 'dislike', null] as const
export type MessageRating = typeof MessageRatings[number]
