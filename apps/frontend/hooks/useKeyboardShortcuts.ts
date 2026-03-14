'use client';

import { useEffect } from 'react';

type ShortcutMap = Record<string, () => void>;

export function useKeyboardShortcuts(
    shortcuts: ShortcutMap,
    active: boolean = true
) {
    useEffect(() => {
        if (!active) return;

        const handler = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const tag = target.tagName;

            // Ignore keyboard shortcuts if the user is typing in an input
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || target.isContentEditable) return;

            const key = [
                e.ctrlKey && 'Ctrl',
                e.shiftKey && 'Shift',
                e.altKey && 'Alt',
                e.key.length === 1 ? e.key.toLowerCase() : e.key
            ].filter(Boolean).join('+');

            if (shortcuts[key]) {
                e.preventDefault();
                shortcuts[key]();
            }
        };

        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [shortcuts, active]);
}
