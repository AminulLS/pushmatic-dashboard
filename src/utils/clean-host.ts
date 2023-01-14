const cleanHost = (host: string): string => {
    if (host.indexOf('www.') === 0) {
        return host.replace('www.', '')
    }

    return host
}

export default cleanHost
