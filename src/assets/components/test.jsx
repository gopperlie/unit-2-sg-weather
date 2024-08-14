import { useState, useEffect } from 'react';
import { get2hrAirtable } from '../services/atableServices';

export default function Weather2hrs() {
    const [areaMetadata, setAreaMetadata] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const [timestamp, setTimestamp] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [aTableData, setATableData] = useState({});
    const [error, setError] = useState(null);

    async function getDataAndMapProperties() {
        const url = `${import.meta.env.VITE_API_URL_2HRS}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            if (json.errorMsg) {
                setError(json.errorMsg);
                return;
            }
            const extractedTimestamp = json.data.items[0].timestamp;
            setTimestamp(extractedTimestamp);

            const areaMetadata = json.data.area_metadata.map(area => ({
                name: area.name,
                latitude: area.label_location.latitude,
                longitude: area.label_location.longitude,
            }));

            const forecasts = json.data.items.flatMap(item => ({
                forecasts: item.forecasts.map(forecast => ({
                    area: forecast.area,
                    forecast: forecast.forecast,
                })),
            }));

            return { areaMetadata, forecasts };
        } catch (error) {
            console.error(error.message);
            setError(error.message);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const airtableRecords = await get2hrAirtable();
                const { areaMetadata, forecasts } = await getDataAndMapProperties();
                setAreaMetadata(areaMetadata);
                setForecasts(forecasts);

                // Transform airtable data for easy lookup
                const airtableDataMap = airtableRecords.reduce((acc, record) => {
                    acc[record.fields.name] = true;
                    return acc;
                }, {});
                setATableData(airtableDataMap);
            } catch (error) {
                console.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const groupedForecasts = areaMetadata.map(area => {
        const areaForecasts = forecasts.flatMap(forecast =>
            forecast.forecasts.filter(f => f.area === area.name).map(f => ({
                forecast: f.forecast,
            }))
        );
        return {
            ...area,
            forecasts: areaForecasts,
        };
    });

    const handleDelete = (areaName) => {
        // Delete logic here
    };

    const handleAdd = (areaName) => {
        // Add logic here
    };

    return (
        <div>
            <h2>{new Date(timestamp).toLocaleString()}</h2>
            {groupedForecasts.map((area, index) => (
                <div key={index} className="card">
                    <h3>{area.name}</h3>
                    <p>Latitude: {area.latitude}, Longitude: {area.longitude}</p>
                    {area.forecasts.map((f, i) => (
                        <div key={i}>
                            <p>Forecast: {f.forecast}</p>
                        </div>
                    ))}
                    {aTableData[area.name] ? (
                        <button onClick={() => handleDelete(area.name)}>Delete</button>
                    ) : (
                        <button onClick={() => handleAdd(area.name)}>Add</button>
                    )}
                </div>
            ))}
        </div>
    );
}
