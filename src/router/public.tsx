import type { RouteObject } from 'react-router-dom'

import Auth from '../public/auth'
import Home from '../public/home'

const items: RouteObject[] = [
    {
        index: true,
        element: <Home />
    },
    {
        path: 'auth/login',
        element: <Auth />
    }
]

export default items
