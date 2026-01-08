import {
  CalendarOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  InboxOutlined,
} from '@ant-design/icons'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePersistedBoolean } from '@/hooks/usePersistedBoolean'
import type { TaskCounts } from '@/utils/taskFilters'
import { SectionTitle } from '../common/SectionTitle'
import { NavItem } from './NavItem'

interface SmartFilterListProps {
  counts: TaskCounts
  selectedFilter: string
  collapsed: boolean
  onFilterChange: (filter: string) => void
}

export const SmartFilterList = memo(function SmartFilterList({
  counts,
  selectedFilter,
  collapsed,
  onFilterChange,
}: SmartFilterListProps) {
  const { t } = useTranslation('sidebar')
  const [sectionCollapsed, toggleSection] =
    usePersistedBoolean('smartListCollapsed')

  const smartFilters = [
    { id: 'inbox', icon: <InboxOutlined />, count: counts.inbox },
    { id: 'today', icon: <FieldTimeOutlined />, count: counts.today },
    { id: 'tomorrow', icon: <CalendarOutlined />, count: counts.tomorrow },
    { id: 'week', icon: <CalendarOutlined />, count: counts.week },
    { id: 'overdue', icon: <ClockCircleOutlined />, count: counts.overdue },
  ]

  return (
    <div className="mb-2">
      {!collapsed && (
        <SectionTitle
          title={t('smartList.title')}
          collapsed={sectionCollapsed}
          onToggle={toggleSection}
        />
      )}
      {!sectionCollapsed &&
        smartFilters.map((filter) => (
          <NavItem
            key={filter.id}
            active={selectedFilter === filter.id}
            onClick={() => onFilterChange(filter.id)}
            icon={filter.icon}
            name={t(`smartList.${filter.id}`)}
            count={filter.count}
            collapsed={collapsed}
          />
        ))}
    </div>
  )
})
