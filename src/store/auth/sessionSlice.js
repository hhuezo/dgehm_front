import { createSlice } from '@reduxjs/toolkit'

export const sessionSlice = createSlice({
    name: 'auth/session',
    initialState: {
        token: '',
        signedIn: false,
        verificationOn: false,
        tk: null,
    },
    reducers: {
        onSignInSuccess: (state, action) => {
            state.signedIn = true
            state.verificationOn = false

            //IMPORTANTE: el guard usa `tk`
            state.token = action.payload
            state.tk = action.payload
        },
        onSignOutSuccess: (state) => {
            state.signedIn = false
            state.verificationOn = false
            state.token = ''
            state.tk = null
        },
        setToken: (state, action) => {
            state.token = action.payload
            state.tk = action.payload
        },
        setVerificationOn: (state, action) => {
            state.verificationOn = action.payload
        },
        setTk: (state, action) => {
            state.tk = action.payload
        },
    },
})

export const {
    onSignInSuccess,
    onSignOutSuccess,
    setToken,
    setVerificationOn,
    setTk,
} = sessionSlice.actions

export default sessionSlice.reducer
