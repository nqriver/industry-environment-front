import React, { useEffect, useState } from 'react';
import HubSelector from './HubSelector';
import CountrySelector from './CountrySelector';
import DatasetChart from './DatasetChart';
import { Container, Button } from 'react-bootstrap';

function ChartPage() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedHub, setSelectedHub] = useState(null);
  const [exportedData, setExportedData] = useState(null);

  useEffect(() => {
    if (selectedCountry) {
      setSelectedHub(null);
    }
  }, [selectedCountry]);

  const handleExportData = () => {
    if (exportedData) {
      const jsonDataString = JSON.stringify(exportedData);
      const blob = new Blob([jsonDataString], { type: 'application/json' });
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
      <CountrySelector onCountrySelect={setSelectedCountry} />
      {selectedCountry && (
        <HubSelector countryId={selectedCountry.id} onHubSelect={setSelectedHub} />
      )}
      {selectedHub && (
        <>
          <DatasetChart hubId={selectedHub.value} onExportData={setExportedData} />
          <Button onClick={handleExportData}>Eksportuj dane w JSON</Button>
        </>
      )}
    </Container>
  );
}

export default ChartPage;
