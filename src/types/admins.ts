export declare type AuthProfile = {
    id?: string,
    isLoggedIn?: boolean
    name?: string
    email?: string
    status?: string
    role?: string | null
    permissions?: string[] | null
    token?: string | null,
}
