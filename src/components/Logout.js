// Logout.js
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {logout} from '../services/authService';

const Logout = ({onLogout}) => {
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        onLogout();
        navigate('/');
    }, [onLogout, navigate]);

    return null;
};

export default Logout;
