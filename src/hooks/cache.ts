import { useEffect } from 'react';
import { setCache } from '../redux/cache-reducer';
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { ProviderCollection } from '../types/providers';
import { useApiClient } from './api'

export function useProviders(): ProviderCollection {
    const providers = useAppSelector(({ cache }) => cache.providers)
    const client = useApiClient()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (providers) {
            return
        }

        client.get('/providers').then(({ data }) => {
            dispatch(setCache({
                providers: data.providers
            }))
        })

        // eslint-disable-next-line
    }, [])

    return providers ?? {}
}

export function useAdTags(): string[] {
    const adTags = useAppSelector(({ cache }) => cache.ad_tags)
    const client = useApiClient()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (adTags) {
            return
        }

        client.get('/ads/tags').then(({ data }) => {
            dispatch(setCache({
                ad_tags: data.data,
                ad_images: data.images
            }))
        })

        // eslint-disable-next-line
    }, [])

    return adTags ?? []
}

export function useAdImages(): string[] {
    const adImages = useAppSelector(({ cache }) => cache.ad_images)
    const client = useApiClient()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (adImages) {
            return
        }

        client.get('/ads/tags').then(({ data }) => {
            dispatch(setCache({
                ad_tags: data.data,
                ad_images: data.images
            }))
        })

        // eslint-disable-next-line
    }, [])

    return adImages ?? []
}
