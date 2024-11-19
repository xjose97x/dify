'use client'

import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useState } from 'react'
import { createContext, useContext, useContextSelector } from 'use-context-selector'
import ModerationSettingModal from '@/app/components/base/features/new-feature-panel/moderation/moderation-setting-modal'
import ExternalDataToolModal from '@/app/components/app/configuration/tools/external-data-tool-modal'

import type { ModerationConfig, PromptVariable } from '@/models/debug'
import type {
  ExternalDataTool,
} from '@/models/common'
import OpeningSettingModal from '@/app/components/base/features/new-feature-panel/conversation-opener/modal'
import type { OpeningStatement } from '@/app/components/base/features/types'
import type { InputVar } from '@/app/components/workflow/types'

export type ModalState<T> = {
  payload: T
  onCancelCallback?: () => void
  onSaveCallback?: (newPayload: T) => void
  onRemoveCallback?: (newPayload: T) => void
  onEditCallback?: (newPayload: T) => void
  onValidateBeforeSaveCallback?: (newPayload: T) => boolean
  isEditMode?: boolean
  datasetBindings?: { id: string; name: string }[]
}

export type ModalContextState = {
  setShowModerationSettingModal: Dispatch<SetStateAction<ModalState<ModerationConfig> | null>>
  setShowExternalDataToolModal: Dispatch<SetStateAction<ModalState<ExternalDataTool> | null>>
  setShowOpeningModal: Dispatch<SetStateAction<ModalState<OpeningStatement & {
    promptVariables?: PromptVariable[]
    workflowVariables?: InputVar[]
    onAutoAddPromptVariable?: (variable: PromptVariable[]) => void
  }> | null>>
}
const ModalContext = createContext<ModalContextState>({
  setShowModerationSettingModal: () => { },
  setShowExternalDataToolModal: () => { },
  setShowOpeningModal: () => { },
})

export const useModalContext = () => useContext(ModalContext)

// Adding a dangling comma to avoid the generic parsing issue in tsx, see:
// https://github.com/microsoft/TypeScript/issues/15713
// eslint-disable-next-line @typescript-eslint/comma-dangle
export const useModalContextSelector = <T,>(selector: (state: ModalContextState) => T): T =>
  useContextSelector(ModalContext, selector)

type ModalContextProviderProps = {
  children: React.ReactNode
}
export const ModalContextProvider = ({
  children,
}: ModalContextProviderProps) => {
  const [showModerationSettingModal, setShowModerationSettingModal] = useState<ModalState<ModerationConfig> | null>(null)
  const [showExternalDataToolModal, setShowExternalDataToolModal] = useState<ModalState<ExternalDataTool> | null>(null)
  const [showOpeningModal, setShowOpeningModal] = useState<ModalState<OpeningStatement & {
    promptVariables?: PromptVariable[]
    workflowVariables?: InputVar[]
    onAutoAddPromptVariable?: (variable: PromptVariable[]) => void
  }> | null>(null)

  const handleCancelModerationSettingModal = () => {
    setShowModerationSettingModal(null)
    if (showModerationSettingModal?.onCancelCallback)
      showModerationSettingModal.onCancelCallback()
  }

  const handleCancelExternalDataToolModal = () => {
    setShowExternalDataToolModal(null)
    if (showExternalDataToolModal?.onCancelCallback)
      showExternalDataToolModal.onCancelCallback()
  }

  const handleCancelOpeningModal = useCallback(() => {
    setShowOpeningModal(null)
    if (showOpeningModal?.onCancelCallback)
      showOpeningModal.onCancelCallback()
  }, [showOpeningModal])

  const handleSaveModeration = (newModerationConfig: ModerationConfig) => {
    if (showModerationSettingModal?.onSaveCallback)
      showModerationSettingModal.onSaveCallback(newModerationConfig)
    setShowModerationSettingModal(null)
  }

  const handleSaveExternalDataTool = (newExternalDataTool: ExternalDataTool) => {
    if (showExternalDataToolModal?.onSaveCallback)
      showExternalDataToolModal.onSaveCallback(newExternalDataTool)
    setShowExternalDataToolModal(null)
  }

  const handleValidateBeforeSaveExternalDataTool = (newExternalDataTool: ExternalDataTool) => {
    if (showExternalDataToolModal?.onValidateBeforeSaveCallback)
      return showExternalDataToolModal?.onValidateBeforeSaveCallback(newExternalDataTool)
    return true
  }

  const handleSaveOpeningModal = (newOpening: OpeningStatement) => {
    if (showOpeningModal?.onSaveCallback)
      showOpeningModal.onSaveCallback(newOpening)
    setShowOpeningModal(null)
  }

  return (
    <ModalContext.Provider value={{
      setShowModerationSettingModal,
      setShowExternalDataToolModal,
      setShowOpeningModal,
    }}>
      <>
        {children}
        {
          !!showModerationSettingModal && (
            <ModerationSettingModal
              data={showModerationSettingModal.payload}
              onCancel={handleCancelModerationSettingModal}
              onSave={handleSaveModeration}
            />
          )
        }
        {
          !!showExternalDataToolModal && (
            <ExternalDataToolModal
              data={showExternalDataToolModal.payload}
              onCancel={handleCancelExternalDataToolModal}
              onSave={handleSaveExternalDataTool}
              onValidateBeforeSave={handleValidateBeforeSaveExternalDataTool}
            />
          )
        }

        {showOpeningModal && (
          <OpeningSettingModal
            data={showOpeningModal.payload}
            onSave={handleSaveOpeningModal}
            onCancel={handleCancelOpeningModal}
            promptVariables={showOpeningModal.payload.promptVariables}
            workflowVariables={showOpeningModal.payload.workflowVariables}
            onAutoAddPromptVariable={showOpeningModal.payload.onAutoAddPromptVariable}
          />
        )}
      </>
    </ModalContext.Provider>
  )
}

export default ModalContext
