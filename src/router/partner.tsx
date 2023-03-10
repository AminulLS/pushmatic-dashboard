import type { RouteObject } from 'react-router-dom'

import PartnerIndex from '../partner/index'
import ListsLayout from '../partner/lists-layout'
import ListDetails from '../partner/lists/details/index'
import ListDevelopers from '../partner/lists/details/developers'
import ListTesting from '../partner/lists/details/testing'
import ListIndex from '../partner/lists/index'
import ListDetailsLayout from '../partner/lists/details'
import PartnerLayout from '../layouts/partner'

const items: RouteObject[] = [
    {
        path: 'partner',
        element: <PartnerLayout />,
        handle: {
            title: 'Dashboard',
            permissions: ['partner', 'dashboard'],
        },
        children: [
            {
                index: true,
                element: <PartnerIndex />,
                handle: {
                    title: 'Dashboard',
                    permissions: ['dashboard'],
                },
            },
            {
                path: 'lists',
                element: <ListsLayout />,
                handle: {
                    title: 'Lists',
                    permissions: ['lists_read'],
                },
                children: [
                    {
                        index: true,
                        element: <ListIndex />,
                        handle: {
                            title: 'Lists',
                            permissions: ['lists_read'],
                        },
                    },
                    {
                        path: ':list_id',
                        element: <ListDetailsLayout />,
                        handle: {
                            title: 'List Details',
                            permissions: ['lists_read'],
                        },
                        children: [
                            {
                                index: true,
                                element: <ListDetails />,
                                handle: {
                                    title: 'List Details',
                                    permissions: ['lists_read'],
                                },
                            },
                            {
                                path: 'developers',
                                element: <ListDevelopers />,
                                handle: {
                                    title: 'Developers',
                                    permissions: ['lists_developers'],
                                },
                            },
                            {
                                path: 'testing',
                                element: <ListTesting />,
                                handle: {
                                    title: 'Campaigns',
                                    permissions: ['lists_testing'],
                                },
                            }
                        ]
                    }
                ]
            },
        ],
    }
]

export default items
