import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import api from "../services/api";
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { linearRegression, linearRegressionLine } from 'simple-statistics';

function DatasetChart({ hubId, onExportData, onStartYear, onEndYear, onChartType }) {
    const [isTrendLine, setIsTrendLine] = useState(false);
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [chartType, setChartType] = useState("");
    const [dataset, setDataset] = useState({ records: [] });
    const [error, setError] = useState(null);


    const weatherValues = dataset.records.map(record => record.weatherValue);
    const productionValues = dataset.records.map(record => record.productionIndex);
    const weatherMin = Math.min(...weatherValues);
    const weatherMax = Math.max(...weatherValues);
    const productionMin = Math.min(...productionValues);
    const productionMax = Math.max(...productionValues);

    const weatherData = dataset.records.map(record => [record.year, record.weatherValue]);
    const productionData = dataset.records.map(record => [record.year, record.productionIndex]);

    let weatherTrendData = [], productionTrendData = [];
    if (isTrendLine) {
        const weatherTrend = linearRegression(weatherData);
        const weatherTrendline = linearRegressionLine(weatherTrend);
        weatherTrendData = weatherData.map(datum => [datum[0], weatherTrendline(datum[0])]);

        const productionTrend = linearRegression(productionData);
        const productionTrendline = linearRegressionLine(productionTrend);
        productionTrendData = productionData.map(datum => [datum[0], productionTrendline(datum[0])]);
    }

    const getWeatherValue = (chartType) => {
        switch (chartType) {
            case "PRODUCTION_IDX_AND_AVG_DAILY_TEMP":
                return "Średnia dzienna temperatura";
            case "PRODUCTION_IDX_AND_AVG_MAX_DAILY_TEMP":
                return "Średnia maksymalna dzienna temperatura";
            case "PRODUCTION_IDX_AND_AVG_MIN_DAILY_TEMP":
                return "Średnia minimalna dzienna temperatura";
            case "PRODUCTION_IDX_AND_AVG_DAILY_AMPLITUDE":
                return "Średnia amplituda dzienna";
            default:
                return "Nieznana wartość pogodowa";
        }
    }

    const series = [
        {
            name: getWeatherValue(chartType),
            type: 'line',
            data: isTrendLine ? weatherTrendData : weatherData,
        },
        {
            name: 'Indeks rozwoju produkcji przemysłowej',
            type: 'line',
            data: isTrendLine ? productionTrendData : productionData,
        }
    ];

    const generatePlot = () => {
        if (hubId && startYear && endYear && chartType) {
            api.get(`/datasets/${hubId}?begin=${startYear}&end=${endYear}&type=${chartType}`)
                .then(response => {
                    setDataset(response.data);
                    onExportData(response.data);
                    onStartYear(startYear);
                    onEndYear(endYear);
                    onChartType(chartType);
                })
                .catch(error => {
                    setError(error)
                    console.error(error)
                });
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
            size: isTrendLine ? 0 : 5,
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
                decimalsInFloat: 2,
                labels: {
                    formatter: function (val) {
                        return val.toFixed(2)
                    },
                    show: true,
                    showAlways: false,

                },
                title: {
                    text: '°C',
                    rotate: 0
                }
            },
            {
                seriesName: 'Production Index',
                min: productionMin,
                max: productionMax,
                labels: {
                    formatter: function (val) {
                        return val.toFixed(2)
                    },
                    show: true,
                    showAlways: false
                },
                title: {
                    text: 'IDX_2015'
                }
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

    const isInputValid = () => {
        if (!startYear || !endYear) {
            return false;
        }

        if (startYear < 1950 || endYear > 2022) {
            return false;
        }

        return !(startYear >= endYear);
    }

    return (

        <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    Rok początkowy:
                </Form.Label>
                <Col sm="10">
                    <Form.Control
                        type="number"
                        min={1950}
                        max={2022}
                        value={startYear}
                        onChange={e => setStartYear(parseInt(e.target.value))}
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    Rok końcowy:
                </Form.Label>
                <Col sm="10">
                    <Form.Control
                        type="number"
                        min={1950}
                        max={2022}
                        value={endYear}
                        onChange={e => setEndYear(parseInt(e.target.value))}
                    />
                    {!isInputValid() &&
                        <Alert variant="info" className="mt-2">Upewnij się że data początkowa jest większa od 1940 a
                            data końcowa mniejsza od 2022, sprawdź również czy data końcowa jest większa od daty
                            początkowej</Alert>}
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
                        <option value="PRODUCTION_IDX_AND_AVG_DAILY_TEMP">Wskaźnik produkcji i średnia dzienna
                            temperatura
                        </option>
                        <option value="PRODUCTION_IDX_AND_AVG_MAX_DAILY_TEMP">Wskaźnik produkcji i średnia maksymalna
                            dzienna temperatura
                        </option>
                        <option value="PRODUCTION_IDX_AND_AVG_MIN_DAILY_TEMP">Wskaźnik produkcji i średnia minimalna
                            dzienna temperatura
                        </option>
                        <option value="PRODUCTION_IDX_AND_AVG_DAILY_AMPLITUDE">Wskaźnik produkcji i średnia amplituda
                            dzienna
                        </option>
                    </Form.Control>
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column sm="2">
                    Pokaż linię trendu:
                </Form.Label>
                <Col sm="10">
                    <Form.Check
                        type="switch"
                        id="trend-line-switch"
                        checked={isTrendLine}
                        onChange={e => setIsTrendLine(e.target.checked)}
                    />

                </Col>
            </Form.Group>


            <Button onClick={generatePlot} disabled={!isInputValid()}>Generuj wykres</Button>
            <div>
                <Chart options={options} series={series} type="line" height={350}/>
            </div>


        </Form>
    );
}

export default DatasetChart;