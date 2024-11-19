import type { Fetcher } from 'swr'
import { get, post } from './base'

import type { RETRIEVE_METHOD } from '@/types/app'

export const fetchFilePreview: Fetcher<{ content: string }, { fileID: string }> = ({ fileID }) => {
  return get<{ content: string }>(`/files/${fileID}/preview`)
}

type RetrievalMethodsRes = {
  'retrieval_method': RETRIEVE_METHOD[]
}

export const fetchSupportRetrievalMethods: Fetcher<RetrievalMethodsRes, string> = (url) => {
  return get<RetrievalMethodsRes>(url)
}

export const uploadRemoteFileInfo = (url: string, isPublic?: boolean) => {
  return post<{ id: string; name: string; size: number; mime_type: string; url: string }>('/remote-files/upload', { body: { url } }, { isPublicAPI: isPublic })
}
