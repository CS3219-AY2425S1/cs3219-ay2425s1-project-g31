export const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const capitalizeFirstLowerRest = (value: string) => {
    return value.charAt(0).toUpperCase() + value.toLocaleLowerCase().slice(1)
}
