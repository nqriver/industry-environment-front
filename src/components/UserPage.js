import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert, Container, Table, Card } from 'react-bootstrap';
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
                setError(null)
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
            <Card>
                <Card.Body>
                    <Table responsive>
                        <tbody>
                        <tr>
                            <th>Imię:</th>
                            <td>{user.name}</td>
                        </tr>
                        <tr>
                            <th>Login:</th>
                            <td>{user.login}</td>
                        </tr>
                        <tr>
                            <th>Email:</th>
                            <td>{user.email}</td>
                        </tr>
                        <tr>
                            <th>Numer telefonu:</th>
                            <td>{user.phoneNumber}</td>
                        </tr>
                        <tr>
                            <th>Rola:</th>
                            <td>{user.role}</td>
                        </tr>
                        </tbody>
                    </Table>
                    <Button variant="primary" onClick={handleShow}>
                        Edytuj
                    </Button>
                </Card.Body>
            </Card>

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
    );};

export default UserPage;
