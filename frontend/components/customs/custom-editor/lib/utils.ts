type DebouncedFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): DebouncedFunction<T> {
    let timeoutId: ReturnType<typeof setTimeout>

    return function (this: any, ...args: Parameters<T>) {
        // Explicitly type `this`
        clearTimeout(timeoutId)

        timeoutId = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

export const noop = () => {}
