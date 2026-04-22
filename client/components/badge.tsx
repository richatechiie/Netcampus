interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'default'
  label: string
}

export function Badge({ variant, label }: BadgeProps) {
  const colorMap = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${colorMap[variant]}`}>
      {label}
    </span>
  )
}
