import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input, Button, FormItem, FormContainer } from 'components/ui';
import { ActionLink } from 'components/shared';

import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import useAuth from 'utils/hooks/useAuth';
import { Notification, toast } from 'components/ui';
import useDebounce from 'utils/hooks/useDebounce';
import { setVerificationOn } from 'store/auth/sessionSlice';

const validationSchema = Yup.object().shape({
  code: Yup.string().required(' '),
});

const VerifyForm = () =>
{

  const { verify,getTwoFactorExpiresAt } = useAuth();
  const [message, setMessage] = useState('');
  const [ time, setTime ] = useState(180000);
  const dispatch = useDispatch();

  const openNotification = (type, title, message) => {
    const borderColor = type === 'success' ? 'border-slate-200' : 'border-red-200';
    const placement = type === 'success' ? 'top-end' : 'top-end';
    toast.push(
      <Notification className={borderColor} title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={5000}>
        {message}
      </Notification>, { placement: placement}
    );
  };

  const onVerify = async (values, setSubmitting) => {
    const { code } = values;
    setSubmitting(true);

    const result = await verify({ code });

    if (result.status === 200) {
      openNotification('success', '¡Bienvenido!', result.message);
    } else {
      openNotification('danger', 'Error', result.message);
      setMessage(result.message);
      setSubmitting(false);
    }
  };

  const handleReturnSignIn = () => {
    dispatch(setVerificationOn(false));
  };

  useEffect(() => {
    const fetchExpiresAt = async () => {
      const resp = await getTwoFactorExpiresAt();
      if (resp.status === 200) {
        const expiresAt = new Date(resp.expires_at);
        const now = new Date();
        setTime(expiresAt - now);
      }
    };

    fetchExpiresAt();
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    if (time <= 0) {
      openNotification('warning', 'Tiempo agotado', 'El tiempo para ingresar el código de verificación ha finalizado. Por favor, ingresa nuevamente tus credenciales');
      dispatch(setVerificationOn(false));
    }
  }, [time]);
  

  
  return (
    <div className="className">
      <div className="mb-8">
        <h2 className="mb-1">Código de Verificación</h2>
        <p className='text-xl'>Introduce el último código de verificación enviado a tu correo</p>
      </div>
      <Formik
        initialValues={{
          code: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          onVerify(values, setSubmitting);
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem className='text-xl text-center' label="" invalid={errors.code && touched.code} errorMessage={errors.code}>
                <Field type="text" className='text-center tracking-widest mb-5' autoComplete="off" name="code" placeholder="XXXXXX" component={Input} />
                <div className={`flex justify-end items-center gap-4 ${ time <= (3000*10) ? 'text-danger' : ( time >= (3000*10) && time <= (6000*10) ? 'text-warning' : 'text') }`}>
                  <div className='w-6/12'></div>
                  <div className={`w-6/12 flex justify-end items-center gap-4`}>
                    <span className='w-10/12 font-semibold'>Tiempo restante:</span>
                    <span className='w-2/12'>{Math.floor(time / 60000)}:{((time % 60000) / 1000).toFixed(0).padStart(2, '0')}</span>
                  </div>
                </div>
              </FormItem>
              
              <div className="flex justify-between items-center">
                <span className='text-xl m-0 p-0 hover:text-buke-500 hover:cursor-pointer font-semibold' size='xs' variant='plain' onClick={handleReturnSignIn}>
                  Regresar a Inicio de Sesión
                </span>
                <div className="w-2/5">
                  <Button className={`text-center`} block loading={isSubmitting} variant="solid" type="submit">
                    {isSubmitting ? 'Verificando...' : 'Verificar'}
                  </Button>
                </div>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default VerifyForm;