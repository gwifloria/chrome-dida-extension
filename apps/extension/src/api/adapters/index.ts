// Types
export type {
  ITaskAdapter,
  CreateTaskInput,
  UpdateTaskInput,
  GetAllTasksResult,
  AdapterType,
  AdapterConfig,
} from './types'

// Adapters
export { DidaListAdapter, didaListAdapter } from './DidaListAdapter'

// Factory
export { createTaskAdapter, getDefaultAdapter } from './factory'
