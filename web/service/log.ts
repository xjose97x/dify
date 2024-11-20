import type { Fetcher } from 'swr'
import { get } from './base'
import type {
  WorkflowRunDetailResponse,
} from '@/models/log'
import type { NodeTracingListResponse } from '@/types/workflow'

export const fetchRunDetail = ({ appID, runID }: { appID: string; runID: string }) => {
  return get<WorkflowRunDetailResponse>(`/apps/${appID}/workflow-runs/${runID}`)
}

export const fetchTracingList: Fetcher<NodeTracingListResponse, { url: string }> = ({ url }) => {
  return get<NodeTracingListResponse>(url)
}
