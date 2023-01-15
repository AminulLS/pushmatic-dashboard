export const parseSegments = (fullPath: string): string[] => {
    const segments = fullPath.split('/').reverse()
    let current = fullPath

    const results = segments.map((path) => {
        current = current.replace(new RegExp('/' + path + '$'), '')

        return current
    }).filter(p => p)

    return [fullPath, ...results]
}
