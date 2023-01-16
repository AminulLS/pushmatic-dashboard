export const parseSegments = (fullPath: string): string[] => {
    const segments = fullPath.split('/').reverse()
    let current = fullPath

    const results = segments.map((path) => {
        current = current.replace(new RegExp('/' + path + '$'), '')

        return current
    }).filter(p => p)

    return [fullPath, ...results]
}

export const appendSearchParams = (link: string, tags: string[]) => {
    try {
        const url = new URL(link)
        const customParams = tags.map((val: string) => [val, `{{${val}}}`]) ?? []
        const params = new URLSearchParams([
            ...Array.from(url.searchParams.entries()),
            ...customParams,
        ])

        return `${url.origin}${url.pathname}?${decodeURI(params.toString())}`
    } catch (_) {
        return null
    }
}
