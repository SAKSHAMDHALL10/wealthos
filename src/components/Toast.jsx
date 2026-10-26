import { useEffect } from 'react'

// A tiny reusable toast. `message` is null when there is nothing to show.
// The side effect here — starting/clearing a timer — is exactly what
// useEffect is for, so the toast disappears on its own after a couple
// of seconds instead of the user having to dismiss it.
export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onDismiss, 2500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message])

  if (!message) return null

  return (
    <div className="toast" role="status">
      {message}
    </div>
  )
}
