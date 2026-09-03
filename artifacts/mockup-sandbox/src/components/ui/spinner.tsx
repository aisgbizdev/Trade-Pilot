import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      // lucide-react resolves its own nested @types/react copy in this
      // workspace, so the spread props' `ref` is structurally identical
      // but nominally distinct from what Loader2Icon expects.
      {...(props as React.ComponentProps<typeof Loader2Icon>)}
    />
  )
}

export { Spinner }
