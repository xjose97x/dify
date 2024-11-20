import type { Viewport } from 'reactflow'
import type { VisionFile } from '@/types/app'
import type {
  Edge,
  Node,
} from '@/app/components/workflow/types'
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

export const CompletionParams = ['temperature', 'top_p', 'presence_penalty', 'max_token', 'stop', 'frequency_penalty'] as const

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

export type WorkflowRunDetail = {
  id: string
  version: string
  status: 'running' | 'succeeded' | 'failed' | 'stopped'
  error?: string
  elapsed_time: number
  total_tokens: number
  total_price: number
  currency: string
  total_steps: number
  finished_at: number
}
export type AccountInfo = {
  id: string
  name: string
  email: string
}
export type EndUserInfo = {
  id: string
  type: 'browser' | 'service_api'
  is_anonymous: boolean
  session_id: string
}

export type WorkflowRunDetailResponse = {
  id: string
  sequence_number: number
  version: string
  graph: {
    nodes: Node[]
    edges: Edge[]
    viewport?: Viewport
  }
  inputs: string
  status: 'running' | 'succeeded' | 'failed' | 'stopped'
  outputs?: string
  error?: string
  elapsed_time?: number
  total_tokens?: number
  total_steps: number
  created_by_role: 'account' | 'end_user'
  created_by_account?: AccountInfo
  created_by_end_user?: EndUserInfo
  created_at: number
  finished_at: number
}

export type ToolCall = {
  status: string
  error?: string | null
  time_cost?: number
  tool_icon: any
  tool_input?: any
  tool_output?: any
  tool_name?: string
  tool_label?: any
  tool_parameters?: any
}
