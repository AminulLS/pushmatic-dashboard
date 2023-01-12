import Dashboard from '../layouts/Dashboard'
import Index from '../admin/Index'
import ListDetails from '../admin/ListDetails'
import Lists from '../admin/Lists';

const items = [
    {
        title: 'Dashboard',
        path: '/admin',
        element: <Dashboard />,
        permissions: ['dashboard'],
        children: [
            {
                index: true,
                element: <Index />,
                permissions: ['dashboard'],
                hidden: true,
            }, {
                title: 'Lists',
                path: 'lists',
                element: <Lists />,
                permissions: ['lists_read', 'lists_edit', 'list_delete'],
            }, {
                title: 'List Details',
                path: 'lists/:list_id/*',
                element: <ListDetails />,
                permissions: ['lists_read', 'lists_edit', 'lists_delete'],
                hidden: true,
            }, {
                title: 'Reports',
                path: 'reports',
                element: <Dashboard />,
                permissions: ['reports_master'],
            }, {
                title: 'Admins',
                path: 'admins',
                element: <Dashboard />,
                permissions: ['admins_read', 'admins_edit', 'admins_delete'],
            },
        ]
    },
]

export default items
