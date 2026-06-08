interface CalloutProps {
  type?: 'info' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: '💡',
      textColor: 'text-blue-900',
      titleColor: 'text-blue-900',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: '⚠️',
      textColor: 'text-amber-900',
      titleColor: 'text-amber-900',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: '❌',
      textColor: 'text-red-900',
      titleColor: 'text-red-900',
    },
  }

  const style = styles[type]

  return (
    <div className={`${style.bg} ${style.border} border-l-4 rounded-md p-4 my-4`}>
      {title && (
        <div className={`flex items-center gap-2 font-semibold ${style.titleColor} mb-2`}>
          <span>{style.icon}</span>
          {title}
        </div>
      )}
      <div className={`${style.textColor} text-sm`}>{children}</div>
    </div>
  )
}
