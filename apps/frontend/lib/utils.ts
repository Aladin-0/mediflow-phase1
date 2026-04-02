import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatQty(
    qty_strips: number,
    qty_loose: number,
    pack_size: number | null
): string {
    if (!pack_size || pack_size <= 1) {
        if (qty_strips > 0 && qty_loose > 0)
            return qty_strips + " strip + " + qty_loose + " loose"
        if (qty_strips > 0) return qty_strips + " strip"
        return qty_loose + " loose"
    }
    const extra = Math.floor(qty_loose / pack_size)
    const rem = qty_loose % pack_size
    const total_strips = qty_strips + extra
    if (total_strips > 0 && rem > 0)
        return total_strips + " strip + " + rem + " loose"
    if (total_strips > 0) return total_strips + " strip"
    return rem + " loose"
}
