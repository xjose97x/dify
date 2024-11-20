export type Inputs = Record<string, string | number | object>

export type PromptVariable = {
  key: string
  name: string
  type: string // "string" | "number" | "select",
  default?: string | number
  required?: boolean
  options?: string[]
  max_length?: number
  is_context_var?: boolean
  enabled?: boolean
  config?: Record<string, any>
  icon?: string
  icon_background?: string
}
