import { atom } from 'recoil'

export const userState = atom({
    key: 'isAuth',
    default: false,
})
