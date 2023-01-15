import { AxiosInstance } from 'axios'
import { useAppSelector } from '../redux/hooks'
import { client } from '../services/api'
import type { AuthProfile } from '../types/admins'

export const useApiClient = (): AxiosInstance => {
    const auth = useAppSelector<AuthProfile>(({ auth }) => auth)

    const instance = client()

    instance.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

    return instance
}
