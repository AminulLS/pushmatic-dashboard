import { AxiosInstance } from 'axios';
import { useAppSelector } from '../redux/hooks'
import { client } from '../services/api';

export const useApiClient = (): AxiosInstance => {
    const auth = useAppSelector(({ auth }) => auth)

    const instance = client()

    instance.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`

    return instance
}
