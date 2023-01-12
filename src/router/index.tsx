import { createBrowserRouter } from 'react-router-dom'
import Blank from '../layouts/blank'
import ErrorPage from '../public/error-page'
import admin from './admin'
import partner from './partner'
import publik from './public'

const base = [
    {
        path: '/',
        element: <Blank />,
        errorElement: <ErrorPage />,
    },
]

const routes = createBrowserRouter([...base, ...publik, ...admin, ...partner])
export default routes
