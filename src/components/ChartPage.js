import React, {useEffect, useState} from 'react';
import HubSelector from './HubSelector';
import CountrySelector from './CountrySelector';
import DatasetChart from './DatasetChart';
import {Button, Container, Alert} from 'react-bootstrap';
import api from "../services/api";

function ChartPage() {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedHub, setSelectedHub] = useState(null);
    const [exportedData, setExportedData] = useState(null);
    const [error, setError] = useState(null);
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [chartType, setChartType] = useState("");

    useEffect(() => {
        if (selectedCountry) {
            setSelectedHub(null);
        }
    }, [selectedCountry]);

    const handleExportDataXML = () => {
        if (selectedHub && startYear && endYear && chartType) {
            api.get(`/datasets/${selectedHub.value}/xml?begin=${startYear}&end=${endYear}&type=${chartType}`, {headers: {'Accept': 'application/xml'}})
                .then(response => {
                    const blob = new Blob([response.data], {type: 'application/xml'});
                    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
                    const fileName = `data_${timestamp}.xml`;
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                })
                .catch(error => {
                    setError(error)
                    console.error(error)
                });
        }
    };

    const handleExportDataJson = () => {
        if (exportedData) {
            const jsonDataString = JSON.stringify(exportedData);
            const blob = new Blob([jsonDataString], {type: 'application/json'});
            const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
            const fileName = `data_${timestamp}.json`;
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        }
    };

    return (
        <Container>
            <CountrySelector onCountrySelect={setSelectedCountry}/>
            {selectedCountry && (
                <HubSelector countryId={selectedCountry.id} onHubSelect={setSelectedHub}/>
            )}
            {selectedHub && (
                <>
                    <DatasetChart
                        hubId={selectedHub.value}
                        onExportData={setExportedData}
                        onStartYear={setStartYear}
                        onEndYear={setEndYear}
                        onChartType={setChartType}
                    />
                    <Button variant="success" onClick={handleExportDataXML}>Eksportuj dane w XML</Button>
                    <Button variant="warning" className="ml-2" onClick={handleExportDataJson}>Eksportuj dane w JSON</Button>
                </>
            )}
            {error && <Alert variant="danger">{error}</Alert>}

        </Container>
    );
}

export default ChartPage;
