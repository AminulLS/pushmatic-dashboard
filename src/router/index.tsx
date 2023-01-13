import { createBrowserRouter } from 'react-router-dom'
import Main from '../layouts/main'
import ErrorPage from '../public/error-page'
import admin from './admin'
import partner from './partner'
import publik from './public'

const routes = [
    {
        path: '/',
        element: <Main />,
        errorElement: <ErrorPage />,
        children: [...publik, ...admin, ...partner]
    },
]

const router = createBrowserRouter(routes)
export default router
