import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePersistedSet } from '@/hooks/usePersistedSet'
import type { Project } from '@/types'
import { SectionTitle } from '../common/SectionTitle'
import { NavItem } from './NavItem'
import { NavFolder } from './NavFolder'
import type { ProjectWithCount, FolderGroup } from './types'

interface ProjectListProps {
  projects: Project[]
  /** 每个项目的任务数量，从统一数据源获取 */
  projectCounts: Map<string, number>
  selectedFilter: string
  collapsed: boolean
  onFilterChange: (filter: string) => void
}

export function ProjectList({
  projects,
  projectCounts,
  selectedFilter,
  collapsed,
  onFilterChange,
}: ProjectListProps) {
  const { t } = useTranslation('sidebar')
  const [collapsedFolders, toggleFolder] = usePersistedSet(
    'sidebarFoldersCollapsed'
  )

  const { folders, ungroupedProjects } = useMemo(() => {
    // 直接使用统一数据源的 projectCounts，无需再遍历 tasks
    const projectsWithCount: ProjectWithCount[] = projects
      .filter((p) => !p.closed)
      .map((p) => ({
        ...p,
        count: projectCounts.get(p.id) ?? 0,
      }))

    const folderMap = new Map<string, ProjectWithCount[]>()
    const ungrouped: ProjectWithCount[] = []

    projectsWithCount.forEach((p) => {
      if (p.groupId) {
        if (!folderMap.has(p.groupId)) folderMap.set(p.groupId, [])
        folderMap.get(p.groupId)!.push(p)
      } else {
        ungrouped.push(p)
      }
    })

    // Open API 不返回文件夹项目，只返回子项目及其 groupId
    // 因此无法获取文件夹名称，只能显示默认名称
    const folderList: FolderGroup[] = []
    let folderIndex = 0
    folderMap.forEach((projectList, groupId) => {
      folderIndex++
      folderList.push({
        id: groupId,
        name: t('folder.defaultName', { index: folderIndex }),
        projects: projectList.sort((a, b) => a.sortOrder - b.sortOrder),
      })
    })

    return {
      folders: folderList.sort((a, b) => a.id.localeCompare(b.id)),
      ungroupedProjects: ungrouped.sort((a, b) => a.sortOrder - b.sortOrder),
    }
  }, [projects, projectCounts, t])

  return (
    <div className="mb-4">
      {!collapsed && <SectionTitle title={t('section.lists')} />}

      {ungroupedProjects.map((project) => (
        <NavItem
          key={project.id}
          active={selectedFilter === `project:${project.id}`}
          onClick={() => onFilterChange(`project:${project.id}`)}
          name={project.name}
          count={project.count}
          color={project.color}
          collapsed={collapsed}
        />
      ))}

      {folders.map((folder) => (
        <NavFolder
          key={folder.id}
          folder={folder}
          collapsed={collapsed}
          isFolderCollapsed={collapsedFolders.has(folder.id)}
          selectedFilter={selectedFilter}
          onToggleFolder={() => toggleFolder(folder.id)}
          onFilterChange={onFilterChange}
        />
      ))}
    </div>
  )
}
