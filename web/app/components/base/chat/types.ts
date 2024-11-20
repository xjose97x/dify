import type {
  ModelConfig,
  VisionSettings,
} from '@/types/app'
import type { IChatItem } from '@/app/components/base/chat/chat/type'
import type { NodeTracing } from '@/types/workflow'
import type { WorkflowRunningStatus } from '@/app/components/workflow/types'
import type { FileEntity } from '@/app/components/base/file-uploader/types'

export type { VisionFile } from '@/types/app'
export { TransferMethod } from '@/types/app'
export type {
  Inputs,
} from '@/models/debug'

export type VisionConfig = VisionSettings

export type EnableType = {
  enabled: boolean
}

export type ChatConfig = Omit<ModelConfig, 'model'> & {
  supportAnnotation?: boolean
  appId?: string
  supportFeedback?: boolean
  supportCitationHitInfo?: boolean
}

export type WorkflowProcess = {
  status: WorkflowRunningStatus
  tracing: NodeTracing[]
  expand?: boolean // for UI
  resultText?: string
  files?: FileEntity[]
}

export type ChatItem = IChatItem & {
  isError?: boolean
  workflowProcess?: WorkflowProcess
  conversationId?: string
  allFiles?: FileEntity[]
}

export type OnSend = (message: string, files?: FileEntity[], last_answer?: ChatItem | null) => void

export type OnRegenerate = (chatItem: ChatItem) => void

export type Callback = {
  onSuccess: () => void
}

export type Feedback = {
  rating: 'like' | 'dislike' | null
}
