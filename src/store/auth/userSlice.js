import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    id: '',
    name: '',
    lastname: '',
    username: '',
    email: '',
    status: '',
    authority: [],
    offices: [] // Array para las oficinas del usuario
}

export const userSlice = createSlice({
    name: 'auth/user',
    initialState,
    reducers: {
        // CORREGIDO: Fusionar el payload (datos de la API) con el estado actual
        setUser: (state, action) => {
            const userPayload = action.payload;

            // Retorna un nuevo estado fusionado
            return {
                ...state, // Mantiene todas las propiedades del estado inicial (lastname, username, status, etc.)
                ...userPayload, // Sobrescribe id, name, email, offices con los datos de la API

                // Mapeo si la API usa 'roles' y el store usa 'authority'
                authority: userPayload.roles || state.authority,

                // Asegurar que offices sea siempre un array
                offices: userPayload.offices || []
            };
        },
        userLoggedOut: () => initialState,
    },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer