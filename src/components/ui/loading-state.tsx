import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  text?: string
  className?: string
}

export function LoadingState({ text = 'Loading...', className }: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className="h-4 w-4 animate-spin" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
} 