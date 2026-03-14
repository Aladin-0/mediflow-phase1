export default function KioskLayout({ children }: { children: React.ReactNode }) {
    // Override dashboard layout by just passing children through.
    // This layout resets the sidebar wrapping provided by the parent via route separation logic in Next.js 
    // Wait, layout overrides only work if we break out of the (dashboard) group, but if we stay in (dashboard), they nest.
    // Actually, to truly override a layout in Next.js App Router, it either needs to be outside the route group or we conditionally hide the sidebar in the parent layout. 
    // If the prompt dictates to put it in app/(dashboard)/attendance/mark/layout.tsx and says "This overrides the parent layout's sidebar for this route only", 
    // Next.js App Router nests layouts. It does *not* override root layouts.
    // To avoid breaking the user's specific instruction "Create: app/(dashboard)/attendance/mark/layout.tsx Simple: return <>{children}</>", I will do exactly that, though technically Next.js will still render the parent layout unless we do CSS hiding or path checking.
    // I will just return children as instructed.
    return <>{children}</>;
}
