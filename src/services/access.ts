export const hasAccess = (permissions: string[], required: string[]): boolean => {
    const filtered = required.filter(p => permissions.includes(p))

    return required.length === filtered.length
}
