export declare interface Admin {
    _id?: string
    name?: string
    email?: string
    status?: 'active' | 'inactive'
    role?: 'admin' | 'partner'
    permissions?: string[]
    created_at?: string
    updated_at?: string
}

export declare type AdminItem = Admin

export declare type AuthProfile = {
    id?: string
    isLoggedIn?: boolean
    token?: string | undefined | null
} & Omit<Admin, '_id'>
