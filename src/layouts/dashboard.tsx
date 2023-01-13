import React from 'react'
import { Navigate, useLocation, useMatches } from 'react-router-dom';
import ErrorPage from '../public/error-page';
import { useAppSelector } from '../redux/hooks';
import { hasAccess } from '../services/access';

function Dashboard({ children }: any) {
    const auth = useAppSelector(({ auth }) => auth)
    const matches = useMatches()
    const location = useLocation()

    if (!auth.isLoggedIn) {
        return <Navigate to={`/auth/login?next=${location.pathname}`} />
    }

    // handle permissions
    const filteredPerms = matches
        .filter(({ handle }: any) => handle?.permissions)
        .map(({ handle }: any) => handle.permissions)
        .flat()
    const reqPerms = Array.from(new Set(filteredPerms))
    const authPerms = Array.from(new Set(auth.permissions))

    if (!hasAccess(authPerms, reqPerms)) {
        return <ErrorPage code={403} title="Unauthorized" subTitle="You don't have access to view this page." />
    }

    return children
}

export default Dashboard
