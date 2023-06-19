import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import api from "../services/api";

function HubSelector({ countryId, onHubSelect }) {
    const [hubs, setHubs] = useState([]);

    useEffect(() => {
        api.get(`/countries/${countryId}/hubs`)
            .then(res => {
                const hubs = res.data.map(hub => ({ value: hub.id, label: hub.hubName }));
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
        <div>
            <h2>Select a Hub</h2>
            <Select
                options={hubs}
                onChange={handleHubChange}
            />
        </div>
    );
}

export default HubSelector;
