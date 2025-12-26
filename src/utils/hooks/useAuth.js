import { useSelector, useDispatch } from 'react-redux';

import { setUser, initialState as userInitialState } from 'store/auth/userSlice';
import { setEmployee, initialState as empInitialState } from 'store/auth/employeeSlice';
import { setFunctionalPosition, initialState as functionalPositionInitialState } from 'store/auth/functionalPositionSlice';
import { setOrganizationalUnit, initialState as organizationalUnitInitialState } from 'store/auth/organizationalUnitSlice';
import { setNotifications, initialState as notificationsInitialState } from 'store/auth/notificationsSlice';
import { setVerificationOn, setTk, onSignInSuccess, onSignOutSuccess } from 'store/auth/sessionSlice';


import { apiAuthentication, apiSignOut, apiSignUp, apiVerify, apiSendTwoFactorExpiresAt } from 'services/AuthService';
import { REDIRECT_URL_KEY } from 'constants/app.constant';
import { useNavigate } from 'react-router-dom';

import useQuery from './useQuery';
import appConfig from 'configs/app.config';

function useAuth() {
	const query = useQuery();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token, signedIn, tk } = useSelector((state) => state.auth.session);
	const { user } = useSelector((state) => state.auth);


	const authentication = async (values) => {
		try {
			const res = await apiAuthentication(values)

			// Verifica si la autenticación fue exitosa
			if (res.status === 200 && res.data.success) {

				const { token, user } = res.data

				// Guardar el token de sesión
				dispatch(onSignInSuccess(token))

				// Guardar el objeto 'user' completo
				if (user) {
					dispatch(setUser(user))
					// CONSOLE.LOG PARA VERIFICAR LOS DATOS DE USUARIO RECIBIDOS
					console.log("Datos de Usuario enviados al setUser (de la API):", user);
				}

				// Guardar tokens en localStorage
				localStorage.setItem('tk', token)
				localStorage.setItem('token', token)

				// Redireccionar
				const redirectUrl = query.get(REDIRECT_URL_KEY)
				navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)

				return { status: 200, message: 'Login exitoso' }
			}

			// Manejo de 2FA
			if (res.status === 200 && res.data.message === 'REQUIRES_TWO_FACTOR') {
				dispatch(setTk(res.data.tk));
				dispatch(setVerificationOn(true));
				return {
					status: '2FA_REQUIRED',
					message: 'Verificación de dos factores requerida'
				}
			}


			// Si el status es 200 pero success es falso
			if (res.status === 200 && !res.data.success) {
				return {
					status: 'failed',
					message: res.data.message || 'Error de autenticación'
				}
			}

			// Caso por defecto si la respuesta no es 200/success
			return {
				status: 'failed',
				message: 'Error de red o servidor no disponible'
			}

		} catch (errors) {
			// Manejo de errores HTTP
			return {
				status: 'failed',
				message:
					errors?.response?.data?.message ||
					errors.toString(),
			}
		}
	}


	const verify = async (values) => {
		try {
			values.tk = tk;
			const resp = await apiVerify(values);
			if (resp.data && resp.status === 200) {
				dispatch(setVerificationOn(false));

				const
					{
						user,
						employee,
						functional_position: functionalPosition,
						organizational_unit: organizationalUnit,
						notifications,
						access_token: token,
						message
					} = resp.data;

				if (user) dispatch(setUser(user || userInitialState));

				if (!user.change_password) {
					dispatch(onSignInSuccess(token));

					if (employee) dispatch(setEmployee(employee || empInitialState));
					if (functionalPosition) dispatch(setFunctionalPosition(functionalPosition || functionalPositionInitialState));
					if (organizationalUnit) dispatch(setOrganizationalUnit(organizationalUnit || organizationalUnitInitialState));
					if (notifications) dispatch(setNotifications(notifications || notificationsInitialState));

					const redirectUrl = query.get(REDIRECT_URL_KEY)
					navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
				}


				return {
					status: 200,
					message: ''
				}


			}
		} catch (errors) {
			return {
				status: 'failed',
				message: errors?.response?.data?.message || errors.toString()
			}
		}
	}

	const getTwoFactorExpiresAt = async () => {
		try {
			const values = {};
			if (tk) {
				values.tk = tk;
			}
			const resp = await apiSendTwoFactorExpiresAt(values);
			if (resp.data && resp.status === 200) {
				return {
					status: 200,
					expires_at: resp.data.expires_at
				}
			}
		} catch (errors) {
			return {
				status: 'failed',
				message: errors?.response?.data?.message || errors.toString()
			}
		}
	}

	const signUp = async (values) => {
		try {
			const resp = await apiSignUp(values)
			if (resp.data) {
				const { token } = resp.data
				dispatch(onSignInSuccess(token))
				if (resp.data.user) {
					dispatch(setUser(resp.data.user || {
						avatar: '',
						userName: 'Anonymous',
						authority: ['USER'],
						email: ''
					}))
				}
				const redirectUrl = query.get(REDIRECT_URL_KEY)
				navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
				return {
					status: 'success',
					message: ''
				}
			}
		} catch (errors) {
			return {
				status: 'failed',
				message: errors?.response?.data?.message || errors.toString()
			}
		}
	}

	const handleSignOut = () => {
		dispatch(onSignOutSuccess());
		dispatch(setUser(userInitialState));
		dispatch(setEmployee(empInitialState));

		dispatch(setFunctionalPosition(functionalPositionInitialState));
		dispatch(setOrganizationalUnit(organizationalUnitInitialState));
		dispatch(setNotifications(notificationsInitialState));
		navigate(appConfig.unAuthenticatedEntryPath);
	}

	const signOut = async () => {
		await apiSignOut();
		handleSignOut();
	}

	return {
		authenticated: token && signedIn,
		user: user,
		authentication,
		verify,
		getTwoFactorExpiresAt,
		signUp,
		signOut
	}
}

export default useAuth