import type {
  VisionFile,
  VisionSettings,
} from '@/types/app'
export type { VisionFile } from '@/types/app'
export { TransferMethod } from '@/types/app'

export type VisionConfig = VisionSettings

export type EnableType = {
  enabled: boolean
}

export type OnSend = (message: string, files?: VisionFile[]) => void
