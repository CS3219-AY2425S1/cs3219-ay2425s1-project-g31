export const encodeStr = (str: string) => {
    return btoa(str)
}

export const decodeStr = (encoded: string) => {
    if (!encoded) return ''
    return atob(encoded)
}
