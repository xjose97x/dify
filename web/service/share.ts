import {
  del as consoleDel, get as consoleGet, patch as consolePatch, post as consolePost,
  delPublic as del, getPublic as get, patchPublic as patch, postPublic as post,
} from './base'
import type { FeedbackType } from '@/app/components/base/chat/chat/type'
import type {
  AppConversationData,
  AppData,
  AppMeta,
  ConversationItem,
} from '@/models/share'
import type { ChatConfig } from '@/app/components/base/chat/types'

function getAction(action: 'get' | 'post' | 'del' | 'patch', isInstalledApp: boolean) {
  switch (action) {
    case 'get':
      return isInstalledApp ? consoleGet : get
    case 'post':
      return isInstalledApp ? consolePost : post
    case 'patch':
      return isInstalledApp ? consolePatch : patch
    case 'del':
      return isInstalledApp ? consoleDel : del
  }
}

export function getUrl(url: string, isInstalledApp: boolean, installedAppId: string) {
  return isInstalledApp ? `installed-apps/${installedAppId}/${url.startsWith('/') ? url.slice(1) : url}` : url
}

export const stopChatMessageResponding = async (appId: string, taskId: string, isInstalledApp: boolean, installedAppId = '') => {
  return getAction('post', isInstalledApp)(getUrl(`chat-messages/${taskId}/stop`, isInstalledApp, installedAppId))
}

export const fetchAppInfo = async () => {
  return get('/site') as Promise<AppData>
}

export const fetchConversations = async (isInstalledApp: boolean, installedAppId = '', last_id?: string, pinned?: boolean, limit?: number) => {
  return getAction('get', isInstalledApp)(getUrl('conversations', isInstalledApp, installedAppId), { params: { ...{ limit: limit || 20 }, ...(last_id ? { last_id } : {}), ...(pinned !== undefined ? { pinned } : {}) } }) as Promise<AppConversationData>
}

export const generationConversationName = async (isInstalledApp: boolean, installedAppId = '', id: string) => {
  return getAction('post', isInstalledApp)(getUrl(`conversations/${id}/name`, isInstalledApp, installedAppId), { body: { auto_generate: true } }) as Promise<ConversationItem>
}

export const fetchChatList = async (conversationId: string, isInstalledApp: boolean, installedAppId = '') => {
  return getAction('get', isInstalledApp)(getUrl('messages', isInstalledApp, installedAppId), { params: { conversation_id: conversationId, limit: 20, last_id: '' } }) as any
}

// init value. wait for server update
export const fetchAppParams = async (isInstalledApp: boolean, installedAppId = '') => {
  return (getAction('get', isInstalledApp))(getUrl('parameters', isInstalledApp, installedAppId)) as Promise<ChatConfig>
}

export const fetchAppMeta = async (isInstalledApp: boolean, installedAppId = '') => {
  return (getAction('get', isInstalledApp))(getUrl('meta', isInstalledApp, installedAppId)) as Promise<AppMeta>
}

export const updateFeedback = async ({ url, body }: { url: string; body: FeedbackType }, isInstalledApp: boolean, installedAppId = '') => {
  return (getAction('post', isInstalledApp))(getUrl(url, isInstalledApp, installedAppId), { body })
}

export const fetchSuggestedQuestions = (messageId: string, isInstalledApp: boolean, installedAppId = '') => {
  return (getAction('get', isInstalledApp))(getUrl(`/messages/${messageId}/suggested-questions`, isInstalledApp, installedAppId))
}

export const audioToText = (url: string, isPublicAPI: boolean, body: FormData) => {
  return (getAction('post', !isPublicAPI))(url, { body }, { bodyStringify: false, deleteContentType: true }) as Promise<{ text: string }>
}

export const textToAudio = (url: string, isPublicAPI: boolean, body: FormData) => {
  return (getAction('post', !isPublicAPI))(url, { body }, { bodyStringify: false, deleteContentType: true }) as Promise<{ data: string }>
}

export const textToAudioStream = (url: string, isPublicAPI: boolean, header: { content_type: string }, body: { streaming: boolean; voice?: string; message_id?: string; text?: string | null | undefined }) => {
  return (getAction('post', !isPublicAPI))(url, { body, header }, { needAllResponseContent: true })
}

export const fetchAccessToken = async (appCode: string) => {
  const headers = new Headers()
  headers.append('X-App-Code', appCode)
  return get('/passport', { headers }) as Promise<{ access_token: string }>
}
