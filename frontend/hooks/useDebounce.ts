import { useCallback, useRef } from 'react'

export function useDebounce<T extends (...args: Parameters<T>) => void>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    return useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = setTimeout(() => {
                callback(...args)
            }, delay)
        },
        [callback, delay]
    )
}

export function useThrottle<T extends (...args: Parameters<T>) => void>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    const lastCallRef = useRef<number>(0)

    return useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now()
            if (now - lastCallRef.current >= delay) {
                lastCallRef.current = now
                callback(...args)
            }
        },
        [callback, delay]
    )
}
