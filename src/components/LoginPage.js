import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container, Form, Row, Col, Alert } from 'react-bootstrap';

const LoginPage = ({ onLogin }) => {
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    const [loginData, setLoginData] = useState({
        login: '',
        password: '',
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(loginData);
            onLogin();
            navigate('/charts'); // przekierowanie po udanym zalogowaniu
        } catch (err) {
            setError(err); // Ustawienie błędu w stanie
        }
    };

    const handleChange = (event) => {
        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <Card className="p-4">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Zaloguj się</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formLogin">
                                    <Form.Label>Login</Form.Label>
                                    <Form.Control type="text" name="login" onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary" type="submit" block>Login</Button>
                                </Form.Group>
                            </Form>
                            {error && <Alert variant='danger'>{error}</Alert>} {/* Wyświetlanie błędu */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
