import { useMemo, useState } from 'react'
import { Badge } from 'antd'
import {
  CalendarOutlined,
  FieldTimeOutlined,
  ClockCircleOutlined,
  InboxOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useTheme } from '@/contexts/ThemeContext'
import { SettingsModal } from './SettingsModal'
import { usePersistedSet } from '@/hooks/usePersistedSet'
import { formatDateStr, extractDateStr } from '@/utils/date'
import { findInboxProject } from '@/utils/project'
import type { ThemeType } from '@/themes'
import type { Task, Project } from '@/types'

// 主题配置：使用各主题的 bgSidebar 颜色
const themeOptions: { type: ThemeType; color: string; name: string }[] = [
  { type: 'journal', color: '#E8E4DF', name: '手帐' },
  { type: 'ocean', color: '#D8E3E8', name: '海洋' },
  { type: 'tech', color: '#1C1C1E', name: '暗黑' },
]

interface SidebarProps {
  tasks: Task[]
  projects: Project[]
  selectedFilter: string
  onFilterChange: (filter: string) => void
}

interface SmartFilter {
  id: string
  name: string
  icon: React.ReactNode
  count: number
}

interface ProjectWithCount extends Project {
  count: number
}

interface FolderGroup {
  id: string
  name: string
  projects: ProjectWithCount[]
  totalCount: number
}

interface FilterItemProps {
  active: boolean
  onClick: () => void
  icon?: React.ReactNode
  name: string
  count: number
  nested?: boolean
  color?: string
}

function FilterItem({
  active,
  onClick,
  icon,
  name,
  count,
  nested = false,
  color,
}: FilterItemProps) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-2.5 py-2 px-3 cursor-pointer rounded-lg my-0.5 transition-all
        ${nested ? 'pl-7' : ''}
        ${active ? 'bg-black/[0.06]' : 'hover:bg-black/[0.04]'}
      `}
    >
      {icon ? (
        <span
          className={`text-base w-5 flex items-center justify-center shrink-0 ${active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
        >
          {icon}
        </span>
      ) : (
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: color || 'var(--accent)' }}
        />
      )}
      <span className="flex-1 text-[13px] text-[var(--text-primary)] truncate">
        {name}
      </span>
      {count > 0 && (
        <Badge
          count={count}
          overflowCount={99}
          className={`
            [&_.ant-badge-count]:bg-transparent [&_.ant-badge-count]:text-[var(--text-secondary)]
            [&_.ant-badge-count]:text-xs [&_.ant-badge-count]:font-normal [&_.ant-badge-count]:shadow-none
            [&_.ant-badge-count]:min-w-0 [&_.ant-badge-count]:h-auto [&_.ant-badge-count]:leading-none [&_.ant-badge-count]:p-0
            ${active ? '[&_.ant-badge-count]:!bg-[var(--text-primary)] [&_.ant-badge-count]:!text-white [&_.ant-badge-count]:!min-w-[18px] [&_.ant-badge-count]:!h-[18px] [&_.ant-badge-count]:!leading-[18px] [&_.ant-badge-count]:!rounded-[9px] [&_.ant-badge-count]:!px-1.5' : ''}
          `}
        />
      )}
    </div>
  )
}

export function Sidebar({
  tasks,
  projects,
  selectedFilter,
  onFilterChange,
}: SidebarProps) {
  const { themeType, setThemeType } = useTheme()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [collapsedFolders, toggleFolder] = usePersistedSet(
    'sidebarFoldersCollapsed'
  )

  const smartFilters = useMemo<SmartFilter[]>(() => {
    const now = new Date()
    const todayStr = formatDateStr(now)
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = formatDateStr(tomorrow)
    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextWeekStr = formatDateStr(nextWeek)

    return [
      {
        id: 'today',
        name: '今天',
        icon: <FieldTimeOutlined />,
        count: tasks.filter(
          (t) => t.dueDate && extractDateStr(t.dueDate) === todayStr
        ).length,
      },
      {
        id: 'tomorrow',
        name: '明天',
        icon: <CalendarOutlined />,
        count: tasks.filter(
          (t) => t.dueDate && extractDateStr(t.dueDate) === tomorrowStr
        ).length,
      },
      {
        id: 'week',
        name: '最近7天',
        icon: <CalendarOutlined />,
        count: tasks.filter((t) => {
          if (!t.dueDate) return false
          const d = extractDateStr(t.dueDate)
          return d >= todayStr && d < nextWeekStr
        }).length,
      },
      {
        id: 'overdue',
        name: '已过期',
        icon: <ClockCircleOutlined />,
        count: tasks.filter(
          (t) => t.dueDate && extractDateStr(t.dueDate) < todayStr
        ).length,
      },
    ]
  }, [tasks])

  const { folders, ungroupedProjects } = useMemo(() => {
    const projectsWithCount: ProjectWithCount[] = projects
      .filter((p) => !p.closed)
      .map((p) => ({
        ...p,
        count: tasks.filter((t) => t.projectId === p.id).length,
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

    const folderList: FolderGroup[] = []
    folderMap.forEach((projectList, groupId) => {
      const totalCount = projectList.reduce((sum, p) => sum + p.count, 0)
      const firstProject = projectList[0]
      folderList.push({
        id: groupId,
        name: firstProject?.name?.split('/')[0] || '文件夹',
        projects: projectList.sort((a, b) => a.sortOrder - b.sortOrder),
        totalCount,
      })
    })

    return {
      folders: folderList.sort((a, b) => a.id.localeCompare(b.id)),
      ungroupedProjects: ungrouped.sort((a, b) => a.sortOrder - b.sortOrder),
    }
  }, [projects, tasks])

  const inboxProject = findInboxProject(ungroupedProjects)
  const otherProjects = ungroupedProjects.filter(
    (p) => p.kind !== 'INBOX' && p.name !== '收集箱'
  )

  return (
    <aside className="w-[240px] bg-[var(--bg-sidebar)] h-full flex flex-col shrink-0">
      {/* 头部 */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🌸</span>
          <span className="font-medium text-[var(--text-primary)]">
            Wonderland
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            {themeOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => setThemeType(option.type)}
                title={option.name}
                className={`
                  w-3 h-3 rounded-full transition-all cursor-pointer border-0 p-0
                  ${themeType === option.type ? 'ring-2 ring-offset-1 ring-[var(--text-secondary)] scale-110' : 'opacity-70 hover:opacity-100 hover:scale-110'}
                `}
                style={{ backgroundColor: option.color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 可滚动内容区 */}
      <div className="flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent">
        {/* 智能清单 */}
        <div className="mb-2">
          <div className="px-3 py-2 text-[11px] font-medium text-[var(--text-secondary)] tracking-wide flex items-center gap-1">
            <span className="text-xs">›</span>
            智能清单
          </div>
          {smartFilters.map((filter) => (
            <FilterItem
              key={filter.id}
              active={selectedFilter === filter.id}
              onClick={() => onFilterChange(filter.id)}
              icon={filter.icon}
              name={filter.name}
              count={filter.count}
            />
          ))}
        </div>

        {/* 清单 */}
        <div className="mb-4">
          <div className="px-3 py-2 text-[11px] font-medium text-[var(--text-secondary)] tracking-wide flex items-center gap-1">
            <span className="text-xs">›</span>
            清单
          </div>

          {inboxProject && (
            <FilterItem
              active={selectedFilter === `project:${inboxProject.id}`}
              onClick={() => onFilterChange(`project:${inboxProject.id}`)}
              icon={<InboxOutlined />}
              name={inboxProject.name}
              count={inboxProject.count}
            />
          )}

          {otherProjects.map((project) => (
            <FilterItem
              key={project.id}
              active={selectedFilter === `project:${project.id}`}
              onClick={() => onFilterChange(`project:${project.id}`)}
              name={project.name}
              count={project.count}
              color={project.color}
            />
          ))}

          {folders.map((folder) => {
            const isCollapsed = collapsedFolders.has(folder.id)
            return (
              <div key={folder.id} className="my-1">
                <div
                  onClick={() => toggleFolder(folder.id)}
                  className={`flex items-center gap-1 py-2 px-3 cursor-pointer rounded-lg transition-all hover:bg-black/[0.04] select-none ${isCollapsed ? 'opacity-80' : ''}`}
                >
                  <span
                    className={`text-xs text-[var(--text-secondary)] w-3.5 text-center transition-transform ${isCollapsed ? '' : '-rotate-90'}`}
                  >
                    ›
                  </span>
                  <span className="text-[11px] font-medium text-[var(--text-secondary)] tracking-wide">
                    {folder.name.toUpperCase()}
                  </span>
                </div>
                {!isCollapsed && (
                  <div className="ml-1">
                    {folder.projects.map((project) => (
                      <FilterItem
                        key={project.id}
                        active={selectedFilter === `project:${project.id}`}
                        onClick={() => onFilterChange(`project:${project.id}`)}
                        name={project.name}
                        count={project.count}
                        color={project.color}
                        nested
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 底部设置按钮 */}
      <div className="p-3 border-t border-[var(--border)]">
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-2 w-full py-2 px-3 text-[13px] text-[var(--text-secondary)] rounded-lg hover:bg-black/[0.04] transition-all cursor-pointer border-0 bg-transparent"
        >
          <SettingOutlined />
          <span>设置</span>
        </button>
      </div>

      {/* 设置弹窗 */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        projects={projects}
      />
    </aside>
  )
}
