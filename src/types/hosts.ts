export type Host = {
    domain: string
    cdn: string
    api: string
    name: string
    title: string
    desc: string
    favicon: string
    logo: string
    icon: string
}

export type HostCollection = {
    [name: string]: Host
}
