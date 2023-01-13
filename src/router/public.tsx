import Auth from '../public/auth'
import Home from '../public/home';

const items = [
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
