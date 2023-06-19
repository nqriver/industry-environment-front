import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import api from "../services/api";

function DatasetChart({ hubId }) {
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
                .then(response => setDataset(response.data))
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
        <div>
            <label>
                Start Year:
                <input value={startYear} onChange={e => setStartYear(e.target.value)} />
            </label>
            <label>
                End Year:
                <input value={endYear} onChange={e => setEndYear(e.target.value)} />
            </label>
            <label>
                Chart Type:
                <select value={chartType} onChange={e => setChartType(e.target.value)}>
                    <option value="">Select chart type</option>
                    <option value="PRODUCTION_IDX_AND_AVG_DAILY_TEMP">Production Index and Average Daily Temp</option>
                    <option value="PRODUCTION_IDX_AND_AVG_MAX_DAILY_TEMP">Production Index and Average Max Daily Temp</option>
                    <option value="PRODUCTION_IDX_AND_AVG_MIN_DAILY_TEMP">Production Index and Average Min Daily Temp</option>
                    <option value="PRODUCTION_IDX_AND_AVG_DAILY_AMPLITUDE">Production Index and Average Daily Amplitude</option>
                </select>
            </label>
            <button onClick={generatePlot}>Generate Plot</button>
            <div>
                <Chart options={options} series={series} type="line" height={350} />
            </div>
        </div>
    );
}

export default DatasetChart;
