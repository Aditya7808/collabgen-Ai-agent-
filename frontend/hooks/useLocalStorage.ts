import { useState, useCallback } from 'react'

interface UseLocalStorageReturn<T> {
    value: T
    setValue: (value: T | ((prev: T) => T)) => void
    removeValue: () => void
}

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): UseLocalStorageReturn<T> {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue
        }
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    })

    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value
                setStoredValue(valueToStore)
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore))
                }
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error)
            }
        },
        [key, storedValue]
    )

    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue)
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key)
            }
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error)
        }
    }, [key, initialValue])

    return { value: storedValue, setValue, removeValue }
}
