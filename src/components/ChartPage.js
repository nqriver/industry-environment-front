import React, {useEffect, useState} from 'react';
import HubSelector from './HubSelector';
import CountrySelector from './CountrySelector';
import DatasetChart from './DatasetChart';
import {Container} from 'react-bootstrap';

function ChartPage() {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedHub, setSelectedHub] = useState(null);

    useEffect(() => {
        if (selectedCountry) {
            setSelectedHub(null);
        }
    }, [selectedCountry]);

    return (
        <Container>
            <CountrySelector onCountrySelect={setSelectedCountry}/>
            {selectedCountry && <HubSelector countryId={selectedCountry.id} onHubSelect={setSelectedHub}/>}
            {selectedHub && <DatasetChart hubId={selectedHub.value}/>}
        </Container>
    );
}

export default ChartPage;
