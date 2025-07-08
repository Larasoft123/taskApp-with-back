import handleAuth from 'auth-astro'
import authConfig from '../../../../auth.config'

export const get = handleAuth(authConfig)
export const post = handleAuth(authConfig)
