'use client'
import type { FC } from 'react'
import React, { useRef, useState } from 'react'
import { useHover } from 'ahooks'
import { useTranslation } from 'react-i18next'
import cn from '@/utils/classnames'
import { MessageCheckRemove, MessageFastPlus } from '@/app/components/base/icons/src/vender/line/communication'
import { MessageFast } from '@/app/components/base/icons/src/vender/solid/communication'
import { Edit04 } from '@/app/components/base/icons/src/vender/line/general'
import Tooltip from '@/app/components/base/tooltip'
import { addAnnotation } from '@/service/annotation'
import Toast from '@/app/components/base/toast'

type Props = {
  appId: string
  messageId?: string
  annotationId?: string
  className?: string
  cached: boolean
  query: string
  answer: string
  onAdded: (annotationId: string, authorName: string) => void
  onEdit: () => void
  onRemoved: () => void
}

const CacheCtrlBtn: FC<Props> = ({
  className,
  cached,
  query,
  answer,
  appId,
  messageId,
  onAdded,
  onEdit,
}) => {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const cachedBtnRef = useRef<HTMLDivElement>(null)
  const isCachedBtnHovering = useHover(cachedBtnRef)
  const handleAdd = async () => {
    const res: any = await addAnnotation(appId, {
      message_id: messageId,
      question: query,
      answer,
    })
    Toast.notify({
      message: t('common.api.actionSuccess') as string,
      type: 'success',
    })
    onAdded(res.id, res.account?.name)
  }

  return (
    <div className={cn('inline-block', className)}>
      <div className='inline-flex p-0.5 space-x-0.5 rounded-lg bg-white border border-gray-100 shadow-md text-gray-500 cursor-pointer'>
        {cached
          ? (
            <div>
              <div
                ref={cachedBtnRef}
                className={cn(isCachedBtnHovering ? 'bg-[#FEF3F2] text-[#D92D20]' : 'bg-[#EEF4FF] text-[#444CE7]', 'flex p-1 space-x-1 items-center rounded-md leading-4 text-xs font-medium')}
                onClick={() => setShowModal(true)}
              >
                {!isCachedBtnHovering
                  ? (
                    <>
                      <MessageFast className='w-4 h-4' />
                      <div>{t('appDebug.feature.annotation.cached')}</div>
                    </>
                  )
                  : <>
                    <MessageCheckRemove className='w-4 h-4' />
                    <div>{t('appDebug.feature.annotation.remove')}</div>
                  </>}
              </div>
            </div>
          )
          : answer
            ? (
              <Tooltip
                popupContent={t('appDebug.feature.annotation.add')}
              >
                <div
                  className='p-1 rounded-md hover:bg-[#EEF4FF] hover:text-[#444CE7] cursor-pointer'
                  onClick={handleAdd}
                >
                  <MessageFastPlus className='w-4 h-4' />
                </div>
              </Tooltip>
            )
            : null
        }
        <Tooltip
          popupContent={t('appDebug.feature.annotation.edit')}
        >
          <div
            className='p-1 cursor-pointer rounded-md hover:bg-black/5'
            onClick={onEdit}
          >
            <Edit04 className='w-4 h-4' />
          </div>
        </Tooltip>

      </div>
    </div>
  )
}
export default React.memo(CacheCtrlBtn)
