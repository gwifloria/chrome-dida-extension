import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePersistedSet } from '@/hooks/usePersistedSet'
import { usePersistedBoolean } from '@/hooks/usePersistedBoolean'
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
  const [sectionCollapsed, toggleSection] = usePersistedBoolean(
    'projectListCollapsed'
  )

  const { folders, ungroupedProjects } = useMemo(() => {
    // 过滤出非文件夹的项目，并附加任务数
    const projectsWithCount: ProjectWithCount[] = projects
      .filter((p) => !p.closed && p.kind !== 'FOLDER')
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

    // 构建文件夹列表（官方 API 不返回文件夹名称，使用默认名称）
    const folderList: FolderGroup[] = []
    let defaultIndex = 0
    folderMap.forEach((projectList, groupId) => {
      folderList.push({
        id: groupId,
        name: t('folder.defaultName', { index: ++defaultIndex }),
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
      {!collapsed && (
        <SectionTitle
          title={t('section.lists')}
          collapsed={sectionCollapsed}
          onToggle={toggleSection}
        />
      )}

      {!sectionCollapsed && (
        <>
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
        </>
      )}
    </div>
  )
}
