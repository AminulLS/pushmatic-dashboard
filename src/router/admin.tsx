import type { RouteObject } from 'react-router-dom'

import Admins from '../admin/admins'
import Reports from '../admin/reports'
import AdminLayout from '../layouts/admin'
import AdminIndex from '../admin/index'
import ListDetailsLayout from '../admin/lists/details'
import ListsIndex from '../admin/lists/index'
import ListsLayout from '../admin/lists-layout'
import ListAds from '../admin/lists/details/ads'
import ListCampaigns from '../admin/lists/details/campaigns'
import ListConfiguration from '../admin/lists/details/configuration'
import ListFunnels from '../admin/lists/details/funnels'
import ListDetails from '../admin/lists/details/index'
import ListDevelopers from '../admin/lists/details/developers'
import ListReports from '../admin/lists/details/reports'
import ListSegments from '../admin/lists/details/segments'
import ListUsers from '../admin/lists/details/users'

const items: RouteObject[] = [
    {
        path: 'admin',
        element: <AdminLayout />,
        handle: {
            title: 'Dashboard',
            permissions: ['admin', 'dashboard']
        },
        children: [
            {
                index: true,
                element: <AdminIndex />,
                handle: {
                    title: 'Dashboard',
                    permissions: ['admin', 'dashboard']
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
                        element: <ListsIndex />,
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
                                path: 'ads',
                                element: <ListAds />,
                                handle: {
                                    title: 'Ads',
                                    permissions: ['ads_read'],
                                },
                            },
                            {
                                path: 'campaigns',
                                element: <ListCampaigns />,
                                handle: {
                                    title: 'Campaigns',
                                    permissions: ['campaigns_read'],
                                },
                            },
                            {
                                path: 'configuration',
                                element: <ListConfiguration />,
                                handle: {
                                    title: 'Configuration',
                                    permissions: ['lists_configuration'],
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
                                path: 'funnels',
                                element: <ListFunnels />,
                                handle: {
                                    title: 'Funnels',
                                    permissions: ['funnels_read'],
                                },
                            },
                            {
                                path: 'reports',
                                element: <ListReports />,
                                handle: {
                                    title: 'Reports',
                                    permissions: ['lists_reports'],
                                },
                            },
                            {
                                path: 'segments',
                                element: <ListSegments />,
                                handle: {
                                    title: 'Segments',
                                    permissions: ['lists_segments'],
                                },
                            },
                            {
                                path: 'users',
                                element: <ListUsers />,
                                handle: {
                                    title: 'Users',
                                    permissions: ['lists_users'],
                                },
                            }
                        ]
                    },
                ]
            },
            {
                path: 'reports',
                element: <Reports />,
                handle: {
                    title: 'Reports',
                    permissions: ['reports_master']
                },
            },
            {
                path: 'admins',
                element: <Admins />,
                handle: {
                    title: 'Admins',
                    permissions: ['admins_read'],
                },
            },
        ]
    },
]

export default items
