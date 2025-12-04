/* eslint-disable react-refresh/only-export-components -- Standard shadcn/ui pattern exports component variants alongside components */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90 h-12 sm:h-11 px-6 touch-target",
        cta: "bg-[var(--blue)] text-[hsl(var(--blue-foreground))] hover:opacity-90 h-12 sm:h-11 px-6 touch-target shadow-lg hover:shadow-xl transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-border bg-background hover:bg-muted hover:text-foreground touch-target",
        secondary:
          "bg-muted text-foreground hover:bg-muted/80 touch-target",
        ghost: "hover:bg-muted hover:text-foreground touch-target",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 sm:h-11 px-6",
        sm: "h-10 sm:h-9 rounded-md px-4",
        lg: "h-12 sm:h-12 rounded-md px-8 text-base touch-target",
        icon: "h-12 sm:h-11 w-12 sm:w-11 touch-target",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
