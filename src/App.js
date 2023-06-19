import React, {useState} from 'react';
import CountrySelector from './components/CountrySelector';
import DatasetChart from "./components/DatasetChart";
import HubSelector from "./components/HubSelector";

function App() {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedHub, setSelectedHub] = useState(null);

    return (
        <div>
            <CountrySelector onCountrySelect={setSelectedCountry}/>
            {selectedCountry && <HubSelector countryId={selectedCountry.id} onHubSelect={setSelectedHub}/>}
            {selectedHub && <DatasetChart hubId={selectedHub.value}/>}

        </div>
    );
}

export default App;
