export const encodeStr = (str: string) => {
    return btoa(str)
}

export const decodeStr = (encoded: string) => {
    return atob(encoded)
}
