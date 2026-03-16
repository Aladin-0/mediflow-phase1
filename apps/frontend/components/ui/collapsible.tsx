'use client';

import * as React from 'react';

interface CollapsibleProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
    className?: string;
}

const CollapsibleContext = React.createContext<{
    open: boolean;
    setOpen: (v: boolean) => void;
}>({ open: false, setOpen: () => {} });

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
    ({ open: controlledOpen, onOpenChange, children, className, ...props }, ref) => {
        const [internalOpen, setInternalOpen] = React.useState(false);
        const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
        const setOpen = (v: boolean) => {
            setInternalOpen(v);
            onOpenChange?.(v);
        };
        return (
            <CollapsibleContext.Provider value={{ open, setOpen }}>
                <div ref={ref} className={className} {...props}>
                    {children}
                </div>
            </CollapsibleContext.Provider>
        );
    }
);
Collapsible.displayName = 'Collapsible';

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
    ({ onClick, children, asChild, ...props }, ref) => {
        const { open, setOpen } = React.useContext(CollapsibleContext);
        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            setOpen(!open);
            onClick?.(e);
        };
        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(children as React.ReactElement<any>, {
                onClick: (e: React.MouseEvent) => {
                    setOpen(!open);
                    (children as React.ReactElement<any>).props.onClick?.(e);
                },
            });
        }
        return (
            <button ref={ref} onClick={handleClick} {...props}>
                {children}
            </button>
        );
    }
);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ children, ...props }, ref) => {
        const { open } = React.useContext(CollapsibleContext);
        if (!open) return null;
        return (
            <div ref={ref} {...props}>
                {children}
            </div>
        );
    }
);
CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
