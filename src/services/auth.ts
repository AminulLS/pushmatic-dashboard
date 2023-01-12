import axios from 'axios'
import { currentHost } from './config'

const config = currentHost

export const login = async (username: string, password: string) => {
    const url = `${config.api}/auth/login`

    const { data } = await axios.post(url, { username, password })

    return data
}

export const profile = async (token: string) => {
    const url = `${config.api}/profile/me`

    const { data } = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

    return data
}

export const reset = async (username: string) => {
    const url = `${config.api}/auth/reset`

    const { data } = await axios.post(url, { username })

    return data
}

export const setPassword = async (token: string, password: string) => {
    const url = `${config.api}/auth/reset`

    const { data } = await axios.post(url, { token, password })

    return data
}

export const logout = async (token: string) => {
    const url = `${config.api}/auth/logout`

    const { data } = await axios.post(url, { token })

    return data
}
