import { PackageOpen } from 'lucide-react'

export default function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon aria-hidden="true" />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  )
}
