import Dashboard from '../layouts/dashboard'
import Admin from '../admin/index'
import ListLayout from '../admin/lists/details'
import ListsIndex from '../admin/lists/index'
import Lists from '../admin/lists'
import ListAds from '../admin/lists/details/ads'
import ListCampaigns from '../admin/lists/details/campaigns'
import ListConfiguration from '../admin/lists/details/configuration'
import ListDetails from '../admin/lists/details/index';
import ListDevelopers from '../admin/lists/details/developers'
import ListReports from '../admin/lists/details/reports'
import ListSegments from '../admin/lists/details/segments'
import ListUsers from '../admin/lists/details/users'

const items = [
    {
        path: '/admin',
        element: <Dashboard />,
        handle: {
            title: 'Dashboard',
            permissions: ['dashboard']
        },
        children: [
            {
                index: true,
                element: <Admin />,
                handle: {
                    permissions: ['dashboard'],
                },
            }, {
                path: 'lists',
                element: <Lists />,
                handle: {
                    title: 'Lists',
                    permissions: ['lists_read'],
                },
                children: [
                    {
                        index: true,
                        element: <ListsIndex />
                    },
                    {
                        path: ':list_id',
                        element: <ListLayout />,
                        handle: {
                            title: 'List Details',
                            permissions: ['lists_read'],
                        },
                        children: [
                            {
                                index: true,
                                element: <ListDetails />
                            }, {
                                path: 'ads',
                                element: <ListAds />,
                                handle: {
                                    title: 'Ads',
                                    permissions: ['ads_read'],
                                },
                            }, {
                                path: 'campaigns',
                                element: <ListCampaigns />,
                                handle: {
                                    title: 'Campaigns',
                                    permissions: ['campaigns_read'],
                                },
                            }, {
                                path: 'configuration',
                                element: <ListConfiguration />,
                                handle: {
                                    title: 'Configuration',
                                    permissions: ['lists_configuration'],
                                },
                            }, {
                                path: 'developers',
                                element: <ListDevelopers />,
                                handle: {
                                    title: 'Developers',
                                    permissions: ['lists_developers'],
                                },
                            }, {
                                path: 'reports',
                                element: <ListReports />,
                                handle: {
                                    title: 'Reports',
                                    permissions: ['lists_reports'],
                                },
                            }, {
                                path: 'segments',
                                element: <ListSegments />,
                                handle: {
                                    title: 'Segments',
                                    permissions: ['lists_segments'],
                                },
                            }, {
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
            }, {
                path: 'reports',
                element: <Dashboard />,
                handle: {
                    title: 'Reports',
                    permissions: ['reports_master']
                },
            }, {
                path: 'admins',
                element: <Dashboard />,
                handle: {
                    title: 'Admins',
                    permissions: ['admins_read', 'admins_edit', 'admins_delete'],
                },
            },
        ]
    },
]

export default items
