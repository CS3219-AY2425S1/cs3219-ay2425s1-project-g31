export interface IAccessTokenPayload {
    id: string
    sub: string
    admin: boolean
    iat: number
    exp: number
    iss: string
    aud: string
}
