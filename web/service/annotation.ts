import { post } from './base'
import type { AnnotationItemBasic } from '@/app/components/app/annotation/type'

export const addAnnotation = (appId: string, body: AnnotationItemBasic) => {
  return post(`apps/${appId}/annotations`, { body })
}
