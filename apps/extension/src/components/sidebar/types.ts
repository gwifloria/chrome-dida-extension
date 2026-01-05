import type { Project } from '@/types'

export interface ProjectWithCount extends Project {
  count: number
}

export interface FolderGroup {
  id: string
  name: string
  projects: ProjectWithCount[]
}
