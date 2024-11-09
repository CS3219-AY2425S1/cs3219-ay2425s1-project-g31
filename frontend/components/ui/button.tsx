import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
                outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
                secondary: 'bg-btn-secondary text-secondary-foreground shadow-sm hover:bg-btn-secondaryHover',
                link: 'text-primary underline-offset-4 hover:underline',
                icon: 'bg-transparent border-[1px] rounded-xl hover:bg-btn-secondaryHover',
                iconNoBorder: 'hover:bg-btn-hover',
                primary: 'bg-theme-600 hover:bg-theme-700 text-primary-foreground',
                activeTab:
                    'text-foreground bg-transparent hover:bg-btn-hover rounded-b-none border-b-2 border-theme-600',
                ghostTab: 'text-foreground bg-transparent hover:bg-btn-hover rounded-b-none',
                activeTabLabel: 'text-white bg-theme-700 rounded-xl',
                ghostTabLabel: 'text-foreground bg-btn-secondary hover:bg-btn-secondaryHover rounded-xl',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 rounded-md px-3 text-xs',
                lg: 'h-10 rounded-md px-8',
                icon: 'h-8 w-8 p-0',
                label: 'px-4 py-1',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
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
        const Comp = asChild ? Slot : 'button'
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
