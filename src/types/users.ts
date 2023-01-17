export interface User {
    _id?: string
    list_id?: string
    token?: string
    first_name?: string
    last_name?: string
    search?: string
    agent?: string
    domain?: string
    href?: string
    location?: string | number
    browser?: string
    device?: string
    optin?: string
    os?: string
    chnl1?: string
    chnl2?: string
    chnl3?: string
    user_ip?: string
    user_ip_status?: 'real' | 'fake' | 'requested' | 'customized'
    status?: 'subscribed' | 'unsubscribed'
    created_at?: string
    updated_at?: string
    last_sent_at?: string
    last_delivered_at?: string
    last_clicked_at?: string
    clicks_any?: number
    clicks_monthly?: number
    clicks_weekly?: string
}

export type UserItem = User
