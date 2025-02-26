import { create } from 'zustand'
import type { App } from '@/types/app'
import type { IChatItem } from '@/app/components/base/chat/chat/type'

type State = {
  appDetail?: App
  currentLogItem?: IChatItem
  showPromptLogModal: boolean
  showAgentLogModal: boolean
  showMessageLogModal: boolean
}

type Action = {
  setCurrentLogItem: (item?: IChatItem) => void
  setShowPromptLogModal: (showPromptLogModal: boolean) => void
  setShowAgentLogModal: (showAgentLogModal: boolean) => void
  setShowMessageLogModal: (showMessageLogModal: boolean) => void
}

export const useStore = create<State & Action>(set => ({
  appDetail: undefined,
  currentLogItem: undefined,
  currentLogModalActiveTab: 'DETAIL',
  setCurrentLogItem: currentLogItem => set(() => ({ currentLogItem })),
  showPromptLogModal: false,
  setShowPromptLogModal: showPromptLogModal => set(() => ({ showPromptLogModal })),
  showAgentLogModal: false,
  setShowAgentLogModal: showAgentLogModal => set(() => ({ showAgentLogModal })),
  showMessageLogModal: false,
  setShowMessageLogModal: showMessageLogModal => set(() => {
    if (showMessageLogModal) {
      return { showMessageLogModal }
    }
    else {
      return {
        showMessageLogModal,
        currentLogModalActiveTab: 'DETAIL',
      }
    }
  }),
}))
