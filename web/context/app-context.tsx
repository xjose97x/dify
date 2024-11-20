'use client'

import { createRef, useCallback, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { createContext, useContext, useContextSelector } from 'use-context-selector'
import type { FC, ReactNode } from 'react'
import { Theme } from '@/types/app'
import type { SystemFeatures } from '@/types/feature'
import { defaultSystemFeatures } from '@/types/feature'

export type AppContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  systemFeatures: SystemFeatures
  pageContainerRef: React.RefObject<HTMLDivElement>
  useSelector: typeof useSelector
}

const AppContext = createContext<AppContextValue>({
  theme: Theme.light,
  setTheme: () => { },
  systemFeatures: defaultSystemFeatures,
  pageContainerRef: createRef(),
  useSelector,
})

export function useSelector<T>(selector: (value: AppContextValue) => T): T {
  return useContextSelector(AppContext, selector)
}

export type AppContextProviderProps = {
  children: ReactNode
}

export const AppContextProvider: FC<AppContextProviderProps> = ({ children }) => {
  const pageContainerRef = useRef<HTMLDivElement>(null)

  const { data: systemFeatures } = useSWR({ url: '/console/system-features' }, {
    fallbackData: defaultSystemFeatures,
  })

  const [theme, setTheme] = useState<Theme>(Theme.light)
  const handleSetTheme = useCallback((theme: Theme) => {
    setTheme(theme)
    globalThis.document.documentElement.setAttribute('data-theme', theme)
  }, [])

  useEffect(() => {
    globalThis.document.documentElement.setAttribute('data-theme', theme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AppContext.Provider value={{
      theme,
      setTheme: handleSetTheme,
      systemFeatures,
      pageContainerRef,
      useSelector,
    }}>
      <div className='flex flex-col h-full overflow-y-auto'>
        <div ref={pageContainerRef} className='grow relative flex flex-col overflow-y-auto overflow-x-hidden bg-background-body'>
          {children}
        </div>
      </div>
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)

export default AppContext
