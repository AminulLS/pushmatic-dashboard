import { RouteObject } from 'react-router/dist/lib/context';

export declare type RouteItemMeta = {
    [name: string]: any
}

export declare type RouteItem = RouteObject & {
    title?: string | null
    classes?: string[],
    meta?: RouteItemMeta,
    permissions?: string[]
}

export declare type Route = RouteItem[];
