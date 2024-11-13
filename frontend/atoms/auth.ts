import { atom } from 'recoil'

export const userState = atom({
    key: 'isAuth',
    default: false,
})

export const tokenState = atom({
    key: 'isValid',
    default: false,
})
