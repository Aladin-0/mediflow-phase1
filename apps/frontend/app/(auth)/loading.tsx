import { Loader2 } from 'lucide-react'

export default function Loading() {
    return (
        <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
    )
}
