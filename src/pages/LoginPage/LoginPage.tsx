import { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { AxiosAdapter } from '../../patterns/AxiosAdapter';
import Loader from '../../components/Loader';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import './LoginPage.scss';

interface LoginFormEssence {
    email: string;
    password: string;
}

interface UserEssence {
    id: string;
    email: string;
    fullname: string;
    active: boolean;
    created_at: string;
    modified_at?: string;
    deleted_at?: string;
}

interface LoginEssence {
    token: string;
    user: UserEssence;
}

interface UserLogged { 
    userId: string; 
    email: string; 
    fullName: string; 
    active: boolean; 
    token: string; 
}

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const [errorMessage, setErrorMessage] = useState<String>('')
    const http = new AxiosAdapter();

    const nav = useNavigate();

    // Implementación de Zustand
    const setUser = useAuthStore((state) => state.setUser);

    const initialValues = {
        email: '',
        password: '',
    }

    const validationSchema = Yup.object({
        email: Yup.string().email('Email debe ser en un formato válido').required('Campo requerido'),
        password: Yup.string().required('Campo requerido'),
    })

    const handleSubmit = async ( values: LoginFormEssence ) => {
        setIsLoading(true);
        try {
            const { token, user } = await http.post<LoginEssence>('http://localhost:3030/api/auth/login', values);
            const userLogged: UserLogged = {
                userId: user.id, 
                email: user.email,
                fullName: user.fullname,
                active: user.active,
                token: token,
            }
            // TODO: si usuario esta inactivo enviar mensaje
            if (!user.active) {
                setErrorMessage('Usuario inactivo, comuniquese con soporte técnico');
                setIsLoading(false);
                return;
            }

            setUser(userLogged);
            sessionStorage.setItem('userLogged', JSON.stringify(userLogged));
            notifySuccess(userLogged);
            setIsLoading(false);
            nav('/dashboard');
        } catch (err: any) {
            setErrorMessage(err.response.data.message);
            setIsLoading(false);
        }
    }

    const handleResetErrorMessage = () => {
        console.log('reseteando error!');
        setErrorMessage('');
    }

    const notifySuccess = (user: UserLogged) => toast.success(`${user.email} ha iniciado sesión correctamente!`, {duration: 2000});

    return (
        <div className="login-page">
            <Formik initialValues={ initialValues } onSubmit={ handleSubmit } validationSchema={ validationSchema }>
                {
                    ( formik ) => (
                        <Form>
                            <div className="login-page__card">
                                <div className="login-page__card-header"></div>
                                <div className="login-page__card-body">
                                    <div className="login-form">
                                        <div className="login-form__group">
                                            <label htmlFor="email">Email</label>
                                            <Field className="login-form__group-input" name="email" type="text" />
                                            <ErrorMessage name="email" component="span" />
                                        </div>
                                        <div className="login-form__group">
                                            <label htmlFor="password">Password</label>
                                            <Field className="login-form__group-input" name="password" type="password" />
                                            <ErrorMessage name="password" component="span" />
                                        </div>
                                    </div>
                                </div>
                                <div className="login-page__card-footer">
                                    <button className="login-btn-submit" type="submit">
                                        {
                                            !isLoading ? (
                                                `Ingresar`
                                            ) : (
                                                <>
                                                    <Loader />
                                                </>    
                                            )
                                        }
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )
                }
            </Formik>
            {
                errorMessage.length > 0 && <span className="login-page__error">
                    { errorMessage }
                    <i className="fa-solid fa-xmark" onClick={ () => handleResetErrorMessage() }></i>
                </span>
            }
        </div>
    )
}

export default LoginPage;
