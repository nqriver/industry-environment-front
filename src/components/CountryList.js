import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import api from '../services/api';

const CountryList = () => {
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [currentCountryId, setCurrentCountryId] = useState(null);
    const [hubs, setHubs] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = (countryId) => {
        setCurrentCountryId(countryId);
        setShow(true);
    };

    useEffect(() => {
        api.get('/countries')
            .then(response => {
                setCountries(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
                setError(error);
            });
    }, []);

    useEffect(() => {
        if (show && currentCountryId) {
            api.get(`/countries/${currentCountryId}/hubs`)
                .then(response => {
                    setHubs(response.data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                    setError(error);
                });
        }
    }, [show, currentCountryId]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <ListGroup>
                        {countries.map(country => (
                            <ListGroup.Item key={country.id} className="mb-6" style={{ borderRadius: '15px', width: '24rem' }}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{country.name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">Code: {country.code}</Card.Subtitle>
                                        <Card.Text>
                                            GDP: {country.gdp}
                                        </Card.Text>
                                        <Button variant="primary" onClick={() => handleShow(country.id)}>
                                            Pokaż ośrodki przemysłowe
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ośrodki przemysłowe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {hubs.map(hub => (
                            <ListGroup.Item key={hub.id}>
                                <h5>{hub.hubName}</h5>
                                <p>
                                    Główne miasto w pobliżu: {hub.mainCityNearby} <br />
                                    Populacja: {hub.population} <br />
                                    PKB per capita: {hub.gdpPerCapita} <br />
                                    Szerokość geograficzna: {hub.latitude} <br />
                                    Długość geograficzna: {hub.longitude}
                                </p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Zamknij
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CountryList;
