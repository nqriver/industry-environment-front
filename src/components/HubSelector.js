import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import api from "../services/api";

import {Form} from 'react-bootstrap';

function HubSelector({countryId, onHubSelect}) {
    const [hubs, setHubs] = useState([]);

    useEffect(() => {
        api.get(`/countries/${countryId}/hubs`)
            .then(res => {
                const hubs = res.data.map(hub => ({value: hub.id, label: hub.hubName}));
                setHubs(hubs);
            })
            .catch(error => {
                console.error('Error fetching hubs:', error);
            });
    }, [countryId]);


    const handleHubChange = selectedOption => {
        onHubSelect(selectedOption);
    };


    return (
        <Form.Group controlId="hubSelect">
            <Form.Label>Wybierz okręg przemysłowy</Form.Label>
            <Select
                options={hubs}
                onChange={handleHubChange}
            />
        </Form.Group>
    );
}

export default HubSelector;
