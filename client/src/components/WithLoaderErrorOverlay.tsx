import { ApolloError } from '@apollo/client'
import { Loader2, BadgeAlert as ErrorIcon } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface WithLoaderErrorOverlayProps {
  loading: boolean
  children: React.ReactNode
  error: Error | ApolloError | undefined
}

const WithLoaderErrorOverlay: React.FC<WithLoaderErrorOverlayProps> = ({
  loading,
  error,
  children,
}) => {
  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  if (loading) {
    return (
      <div className="relative h-full w-full">
        <div className="absolute inset-0 flex flex-1 items-center justify-center bg-black/50">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="relative h-full w-full">
        <div className="absolute inset-0 flex flex-1 items-center justify-center bg-black/50">
          <ErrorIcon className="h-1/3 w-1/3 text-destructive" />
        </div>
      </div>
    )
  }
  return <div className="relative h-full w-full">{children}</div>
}

export default WithLoaderErrorOverlay
