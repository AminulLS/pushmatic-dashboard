import React, { useEffect } from 'react'
import { Spin } from 'antd'
import { Outlet, useMatches } from 'react-router-dom'
import { setAuth } from '../redux/auth-slice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setLoader } from '../redux/loader-slice'
import { profile } from '../services/auth'
import { currentHost } from '../services/config'

const config = currentHost

function Main() {
    const dispatch = useAppDispatch()
    const { auth, loader } = useAppSelector(({ auth, loader }) => ({ auth, loader }))
    const matches = useMatches()

    // Ensure the page title.
    useEffect(() => {
        const lastMatch: any = matches[matches.length - 1]
        const title = lastMatch?.handle?.title
        if (title) {
            document.title = `${title} - ${config.name}`
        } else {
            document.title = config.name
        }
    }, [matches])

    // Ensure user is logged in.
    useEffect(() => {
        const { isLoggedIn, token } = auth

        if (!isLoggedIn && token) {
            profile(token)
                .then(({ profile }) => dispatch(setAuth({
                    ...profile,
                    token,
                })))
                .finally(() => dispatch(setLoader({ booted: true })))

        } else {
            dispatch(setLoader({ booted: true }))
        }
        // eslint-disable-next-line
    }, [])

    // if the page in the loading state
    if (!loader.booted) {
        return (
            <div style={{
                height: '100vh',
                display: 'grid',
                placeItems: 'center',
            }}>
                <Spin size="large" />
            </div>
        )
    }

    return (<Outlet />)
}

export default Main
