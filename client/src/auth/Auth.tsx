import React, { useState, useEffect, useContext, ReactNode } from 'react';
import { AuthContext } from "../App";
import axios from "axios";
import LoginRegister from "../components/Login";

interface AuthProps {
    children: ReactNode;
}

const Auth: React.FC<AuthProps> = ({ children }) => {
    const [redirect, setRedirect] = useState<boolean>(false);
    const { token, setToken, setUserId } = useContext(AuthContext);

    useEffect(() => {
        verify();
    }, []);

    const verify = async() => {
        try {
            const response = await axios.get('http://localhost:5000/user/auth', {
                withCredentials: true,
                headers: {
                    'x-access-token': token
                }
            });
            if (response.status === 200) {
                setToken(response.data.accessToken);
                setUserId(response.data.userId); // Asumiendo que el backend devuelve el email
                setRedirect(true)
            }
        } catch (error) {
            console.log(error);
            setToken(null)
            setUserId(null)
            setRedirect(false)
        }
    }
    return redirect ? children : <LoginRegister mode='Login' />;
}

export default Auth;