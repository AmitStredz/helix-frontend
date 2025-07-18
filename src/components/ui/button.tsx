import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg",
        outline: "border border-border bg-card/20 backdrop-blur-sm text-foreground hover:bg-card/40 hover:border-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-card/40 hover:text-foreground backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-1 hover:from-primary-glow hover:to-primary",
        accent: "bg-gradient-to-r from-accent to-accent-glow text-accent-foreground shadow-lg hover:shadow-xl hover:-translate-y-1",
        glass: "bg-card/10 backdrop-blur-xl border border-white/10 text-foreground hover:bg-card/20 hover:border-primary/30",
        connect: "bg-gradient-to-r from-primary via-accent to-primary-glow animate-gradient-x text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 bg-[length:200%_200%]",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-13 rounded-xl px-8 py-4 text-base",
        icon: "h-11 w-11",
        xl: "h-16 rounded-xl px-12 py-5 text-lg font-semibold",
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
