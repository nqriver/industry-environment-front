import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import api from "../services/api";
import { Button, Form, Col, Row } from 'react-bootstrap';

function DatasetChart({ hubId, onExportData }) {
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [chartType, setChartType] = useState("");
    const [dataset, setDataset] = useState({ records: [] });

    // Find min and max values for both Weather Value and Production Index
    const weatherValues = dataset.records.map(record => record.weatherValue);
    const productionValues = dataset.records.map(record => record.productionIndex);
    const weatherMin = Math.min(...weatherValues);
    const weatherMax = Math.max(...weatherValues);
    const productionMin = Math.min(...productionValues);
    const productionMax = Math.max(...productionValues);

    const generatePlot = () => {
        if (hubId && startYear && endYear && chartType) {
          api.get(`/datasets/${hubId}?begin=${startYear}&end=${endYear}&type=${chartType}`)
            .then(response => {
              setDataset(response.data);
              onExportData(response.data); // Przekazanie danych do ChartPage
            })
            .catch(error => console.error(error));
        }
      };

    const options = {
        chart: {
            type: 'line',
            stacked: false,
            height: 350,
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
            },
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0,
        },
        title: {
            text: dataset.type,
            align: 'left'
        },
        yaxis: [
            {
                seriesName: 'Weather Value',
                opposite: true,
                min: weatherMin,
                max: weatherMax,
            },
            {
                seriesName: 'Production Index',
                min: productionMin,
                max: productionMax,
            }
        ],
        tooltip: {
            shared: false,
            intersect: true,
            x: {
                format: 'yyyy'
            }
        },
        legend: {
            horizontalAlign: 'left',
            offsetX: 40
        }
    };

    const series = [
        {
            name: 'Weather Value',
            type: 'line',
            data: dataset.records.map(record => [record.year, record.weatherValue])
        },
        {
            name: 'Production Index',
            type: 'line',
            data: dataset.records.map(record => [record.year, record.productionIndex])
        }
    ];

    return (
        <Form>
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    Rok początkowy:
                </Form.Label>
                <Col sm="10">
                    <Form.Control
                        value={startYear}
                        onChange={e => setStartYear(e.target.value)}
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    Rok końcowy:
                </Form.Label>
                <Col sm="10">
                    <Form.Control
                        value={endYear}
                        onChange={e => setEndYear(e.target.value)}
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    Typ wykresu:
                </Form.Label>
                <Col sm="10">
                    <Form.Control
                        as="select"
                        value={chartType}
                        onChange={e => setChartType(e.target.value)}
                    >
                        <option value="">Wybierz typ wykresu</option>
                        <option value="PRODUCTION_IDX_AND_AVG_DAILY_TEMP">Wskaźnik produkcji i średnia dzienna temperatura</option>
                        <option value="PRODUCTION_IDX_AND_AVG_MAX_DAILY_TEMP">Wskaźnik produkcji i średnia maksymalna dzienna temperatura</option>
                        <option value="PRODUCTION_IDX_AND_AVG_MIN_DAILY_TEMP">Wskaźnik produkcji i średnia minimalna dzienna temperatura</option>
                        <option value="PRODUCTION_IDX_AND_AVG_DAILY_AMPLITUDE">Wskaźnik produkcji i średnia amplituda dzienna</option>
                    </Form.Control>
                </Col>
            </Form.Group>
            <Button onClick={generatePlot}>Generuj wykres</Button>
            <div>
                <Chart options={options} series={series} type="line" height={350} />
            </div>
        </Form>
    );
}
export default DatasetChart;
