import { atom } from 'recoil'

export const sessionInfo = atom({
    key: 'sessionInfo',
    default: {
        id: '',
        username: '',
        email: '',
    },
})
