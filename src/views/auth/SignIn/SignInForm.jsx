import React from 'react'
import Button from 'components/custom/Button'
import { Input, Checkbox, FormItem, FormContainer } from 'components/ui'
import { PasswordInput, ActionLink } from 'components/shared'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from 'utils/hooks/useAuth'
import { Notification, toast } from 'components/ui'

/**
 * Validación
 */
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Correo electrónico no válido')
    .required('Ingresa tu correo electrónico'),
  password: Yup.string().required('Ingresa tu contraseña'),
  rememberMe: Yup.bool(),
})

const SignInForm = ({
  disableSubmit = false,
  className,
  forgotPasswordUrl = '/forgot-password',
}) => {
  const { authentication } = useAuth()

  const openNotification = (type, title, message) => {
    const borderColor = type === 'success' ? 'border-slate-200' : 'border-red-200'
    toast.push(
      <Notification
        className={borderColor}
        title={title.charAt(0).toUpperCase() + title.slice(1)}
        type={type}
        duration={5000}
      >
        {message}
      </Notification>,
      { placement: 'top-end' }
    )
  }

  const onSignIn = async (values, setSubmitting) => {
    const { email, password } = values

    setSubmitting(true)

    const result = await authentication({ email, password })

    if (result.status === 200) {
      openNotification('success', 'Valida tu sesión', result.message)
    } else {
      openNotification('danger', 'Error', result.message)
      setSubmitting(false)
    }
  }

  return (
    <div className={className}>
      <div>
        <h2 className="mb-1">¡Bienvenido!</h2>
        <h3 className="mb-1">Sistema DGEHM</h3>
      </div>

      <hr className="my-6" />

      <p className="mt-3 mb-8">
        Por favor, introduce tus credenciales para ingresar
      </p>

      <Formik
        initialValues={{
          email: '',
          password: '',
          rememberMe: true,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSignIn(values, setSubmitting)
          } else {
            setSubmitting(false)
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>

              {/* EMAIL */}
              <FormItem
                label="Correo electrónico"
                invalid={errors.email && touched.email}
                errorMessage={errors.email}
              >
                <Field
                  type="email"
                  autoComplete="off"
                  name="email"
                  component={Input}
                />
              </FormItem>

              {/* PASSWORD */}
              <FormItem
                label="Contraseña"
                invalid={errors.password && touched.password}
                errorMessage={errors.password}
              >
                <Field
                  autoComplete="off"
                  name="password"
                  component={PasswordInput}
                />
              </FormItem>

              <div className="flex justify-between mb-6">
                <Field
                  className="mb-0"
                  name="rememberMe"
                  component={Checkbox}
                >
                  Recordarme
                </Field>

                <ActionLink className="text-center" to={forgotPasswordUrl}>
                  ¿Olvidaste la contraseña?
                </ActionLink>
              </div>

              <div className="flex justify-end">
                <div className="w-2/5">
                  <Button
                    block
                    loading={isSubmitting}
                    variant="plain"
                    type="submit"
                    color="primary"
                    disabled={isSubmitting || disableSubmit}
                  >
                    {isSubmitting ? 'Verificando...' : 'Ingresar'}
                  </Button>
                </div>
              </div>

            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignInForm
