import { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { AxiosAdapter } from '../../patterns/AxiosAdapter';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuthStore } from '../../store/authStore';
import type { UserLoggedEssence } from '../../interfaces/auth/auth.interface';
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
    roles: string[];
    created_at: string;
    modified_at?: string;
    deleted_at?: string;
}

interface LoginEssence {
    token: string;
    user: UserEssence;
}

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3030/api';
const http = new AxiosAdapter(API_URL);

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const nav = useNavigate();
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
            const { token, user } = await http.post<LoginEssence>('/auth/login', values);
            if (!user.active) {
                setErrorMessage('Usuario inactivo, comuniquese con soporte técnico');
                setIsLoading(false);
                return;
            }

            const userLogged: UserLoggedEssence = {
                userId: user.id,
                email: user.email,
                fullName: user.fullname,
                active: user.active,
                token: token,
                roles: user.roles,
            }

            setUser(userLogged);
            toast.success(`${user.email} ha iniciado sesión correctamente!`, {duration: 2000});
            setIsLoading(false);
            nav('/dashboard');
        } catch (err: any) {
            setErrorMessage(err.message ?? 'Error inesperado');
            setIsLoading(false);
        }
    }

    const handleResetErrorMessage = () => {
        setErrorMessage('');
    }

    return (
        <div className="login-page">
            <Formik initialValues={ initialValues } onSubmit={ handleSubmit } validationSchema={ validationSchema }>
                {() => (
                    <Form>
                        <div className="login-page__card">
                            <div className="login-page__card-header">
                                <h2>Iniciar Sesión</h2>
                            </div>
                            <div className="login-page__card-body">
                                <div className="login-form">
                                    <div className="login-form__group">
                                        <label htmlFor="email">Email</label>
                                        <Field id="email" className="login-form__group-input" name="email" type="text" aria-describedby="email-error" />
                                        <ErrorMessage name="email">{(msg) => msg ? <span id="email-error">{msg}</span> : null}</ErrorMessage>
                                    </div>
                                    <div className="login-form__group">
                                        <label htmlFor="password">Password</label>
                                        <Field id="password" className="login-form__group-input" name="password" type="password" aria-describedby="password-error" />
                                        <ErrorMessage name="password">{(msg) => msg ? <span id="password-error">{msg}</span> : null}</ErrorMessage>
                                    </div>
                                </div>
                            </div>
                            <div className="login-page__card-footer">
                                <button className="login-page__submit-btn" type="submit">
                                    {!isLoading ? `Ingresar` : <Loader />}
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
            {
                errorMessage.length > 0 && <span className="login-page__error">
                    { errorMessage }
                    <i className="fa-solid fa-xmark" data-testid="dismiss-error" onClick={ () => handleResetErrorMessage() }></i>
                </span>
            }
        </div>
    )
}

export default LoginPage;
