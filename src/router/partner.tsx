import Index from '../partner/Index'
import ListDetails from '../partner/ListDetails'
import Lists from '../partner/Lists'
import Partner from '../layouts/Partner'

const items = [
    {
        title: 'Dashboard',
        path: 'partner',
        element: <Partner />,
        permissions: ['dashboard'],
        children: [
            {
                title: 'Dashboard',
                index: true,
                element: <Index />,
                hidden: true,
                permissions: ['dashboard'],
            }, {
                title: 'Lists',
                path: 'lists',
                element: <Lists />,
                permissions: ['lists_read'],
            }, {
                title: 'List Details',
                path: 'lists/:list_id/*',
                element: <ListDetails />,
                hidden: true,
                permissions: ['lists_read'],
            }
        ],
    }
]

export default items
