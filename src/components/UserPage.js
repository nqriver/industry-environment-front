import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert, Container } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';
import api from '../services/api';

const UserPage = () => {
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const decoded = jwt_decode(token);
        api
            .get(`/users/${decoded.userId}`)
            .then((response) => {
                setUser(response.data);
                setUpdatedUser(response.data);
            })
            .catch((error) => {
                console.error('There was an error!', error);
                setError(error);
            });
    }, []);

    const handleChange = (event) => {
        setUpdatedUser({ ...updatedUser, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        api
            .put(`/users/${user.id}`, updatedUser)
            .then((response) => {
                setUser(response.data);
                handleClose();
            })
            .catch((error) => {
                console.error('There was an error!', error);
                setError(error);
            });
    };

    return (
        <Container className="text-center">
            <h2>Profil</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <p>Imię: {user.name}</p>
            <p>Login: {user.login}</p>
            <p>Email: {user.email}</p>
            <p>Numer telefonu: {user.phoneNumber}</p>
            <p>Rola: {user.role}</p>
            <Button variant="primary" onClick={handleShow}>
                Edytuj
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edytuj profil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Imię</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={updatedUser.name}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formLogin">
                            <Form.Label>Login</Form.Label>
                            <Form.Control
                                type="text"
                                name="login"
                                value={updatedUser.login}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={updatedUser.email}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPhoneNumber">
                            <Form.Label>Numer telefonu</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={updatedUser.phoneNumber}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Zatwierdź
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default UserPage;
