import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { register } from '../services/authService';
import { useNavigate } from "react-router-dom";
import '../styles/RegisterPage.css';

const RegisterPage = ({ onRegistration }) => {
    const [form, setForm] = useState({ name: '', login: '', password: '', email: '', phoneNumber: '', role: '' });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();

    const validate = () => {
        let tempErrors = {};
        tempErrors.name = form.name ? "" : "To pole jest wymagane.";
        tempErrors.login = form.login ? "" : "To pole jest wymagane.";
        tempErrors.password = form.password ? "" : "To pole jest wymagane.";
        tempErrors.email = (form.email && /^\S+@\S+$/.test(form.email)) ? "" : "Wymagany jest prawidłowy adres email.";
        tempErrors.phoneNumber = (form.phoneNumber && form.phoneNumber.length === 9) ? "" : "Wymagany jest prawidłowy numer telefonu.";
        tempErrors.role = form.role ? "" : "To pole jest wymagane.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validate()) {
            try {
                await register(form);
                onRegistration();
                navigate('/');
            } catch (error) {
                setServerError(error);
            }
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="register-page">
            <h1>Zarejestruj się</h1>
            <Form className="register-form" onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Imię</Form.Label>
                    <Form.Control type="text" name="name" onChange={handleChange} />
                    <div style={{ color: "red" }}>{errors.name}</div>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Login</Form.Label>
                    <Form.Control type="text" name="login" onChange={handleChange} />
                    <div style={{ color: "red" }}>{errors.login}</div>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Hasło</Form.Label>
                    <Form.Control type="password" name="password" onChange={handleChange} />
                    <div style={{ color: "red" }}>{errors.password}</div>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" onChange={handleChange} />
                    <div style={{ color: "red" }}>{errors.email}</div>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Numer telefonu</Form.Label>
                    <Form.Control type="tel" name="phoneNumber" onChange={handleChange} />
                    <div style={{ color: "red" }}>{errors.phoneNumber}</div>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Rola</Form.Label>
                    <Form.Control as="select" name="role" onChange={handleChange}>
                        <option value="">Wybierz rolę...</option>
                        <option value="ADMIN">Admin</option>
                        <option value="CONTENT_VIEWER">Content Viewer</option>
                        <option value="CONTENT_DOWNLOADER">Content Downloader</option>
                        <option value="CONTENT_MANAGER">Content Manager</option>
                    </Form.Control>
                    <div style={{ color: "red" }}>{errors.role}</div>
                </Form.Group>
                {serverError && <div style={{ color: "red" }}>{serverError}</div>}
                <Button variant="primary" type="submit">
                    Zarejestruj się
                </Button>
            </Form>
        </div>
    );
};

export default RegisterPage;
