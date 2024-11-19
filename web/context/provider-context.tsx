'use client'

import { createContext, useContext, useContextSelector } from 'use-context-selector'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import {
  fetchSupportRetrievalMethods,
} from '@/service/common'
import type { RETRIEVE_METHOD } from '@/types/app'
import { fetchCurrentPlanInfo } from '@/service/billing'

type ProviderContextState = {
  supportRetrievalMethods: RETRIEVE_METHOD[]
  isAPIKeySet: boolean
  isFetchedPlan: boolean
  enableBilling: boolean
  onPlanInfoChanged: () => void
  enableReplaceWebAppLogo: boolean
  modelLoadBalancingEnabled: boolean
  datasetOperatorEnabled: boolean
}
const ProviderContext = createContext<ProviderContextState>({
  supportRetrievalMethods: [],
  isAPIKeySet: true,
  isFetchedPlan: false,
  enableBilling: false,
  onPlanInfoChanged: () => { },
  enableReplaceWebAppLogo: false,
  modelLoadBalancingEnabled: false,
  datasetOperatorEnabled: false,
})

export const useProviderContext = () => useContext(ProviderContext)

// Adding a dangling comma to avoid the generic parsing issue in tsx, see:
// https://github.com/microsoft/TypeScript/issues/15713
// eslint-disable-next-line @typescript-eslint/comma-dangle
export const useProviderContextSelector = <T,>(selector: (state: ProviderContextState) => T): T =>
  useContextSelector(ProviderContext, selector)

type ProviderContextProviderProps = {
  children: React.ReactNode
}
export const ProviderContextProvider = ({
  children,
}: ProviderContextProviderProps) => {
  const { data: supportRetrievalMethods } = useSWR('/datasets/retrieval-setting', fetchSupportRetrievalMethods)

  const [isFetchedPlan, setIsFetchedPlan] = useState(false)
  const [enableBilling, setEnableBilling] = useState(true)
  const [enableReplaceWebAppLogo, setEnableReplaceWebAppLogo] = useState(false)
  const [modelLoadBalancingEnabled, setModelLoadBalancingEnabled] = useState(false)
  const [datasetOperatorEnabled, setDatasetOperatorEnabled] = useState(false)

  const fetchPlan = async () => {
    const data = await fetchCurrentPlanInfo()
    const enabled = data.billing.enabled
    setEnableBilling(enabled)
    setEnableReplaceWebAppLogo(data.can_replace_logo)
    if (data.model_load_balancing_enabled)
      setModelLoadBalancingEnabled(true)
    if (data.dataset_operator_enabled)
      setDatasetOperatorEnabled(true)
  }
  useEffect(() => {
    fetchPlan()
  }, [])

  return (
    <ProviderContext.Provider value={{
      isAPIKeySet: false,
      supportRetrievalMethods: supportRetrievalMethods?.retrieval_method || [],
      isFetchedPlan,
      enableBilling,
      onPlanInfoChanged: fetchPlan,
      enableReplaceWebAppLogo,
      modelLoadBalancingEnabled,
      datasetOperatorEnabled,
    }}>
      {children}
    </ProviderContext.Provider>
  )
}

export default ProviderContext
