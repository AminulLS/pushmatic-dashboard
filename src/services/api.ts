import axios, { AxiosInstance } from 'axios'
import { currentHost } from './config'

const config = currentHost
export const client = (): AxiosInstance => {
    return axios.create({ baseURL: config.api })
}
