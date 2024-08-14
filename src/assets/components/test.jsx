import { useState, useEffect } from 'react';
import { get2hrAirtable } from '../services/atableServices';
import '../css-scripts/cardscript.css';

export default function Homepage() {
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
                longitude: area.label_location.longitude
            }));

            const forecasts = json.data.items.flatMap(item => ({
                forecasts: item.forecasts.map(forecast => ({
                    area: forecast.area,
                    forecast: forecast.forecast
                }))
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

                const airtableDataMap = airtableRecords.reduce((acc, record) => {
                    acc[record.fields.name] = record.id; // Store the record ID
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

    const handleAdd = async (areaName) => {
        try {
            await saveAreaName(areaName);

            // Update the local state to reflect the new entry in Airtable
            setATableData(prevData => ({
                ...prevData,
                [areaName]: true, // Mark this area as added
            }));
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleDelete = async (areaName) => {
        const recordId = aTableData[areaName]; // Get the record ID from state

        if (!recordId) return; // If no record ID, do nothing

        const url = `${import.meta.env.VITE_API_URL_AIRTABLE_2HRS}/${recordId}`;
        const urlKey = `${import.meta.env.VITE_APIKEY_AIRTABLE}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${urlKey}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete: ${response.status}`);
            }

            // Update the local state to remove the deleted area
            setATableData(prevData => {
                const updatedData = { ...prevData };
                delete updatedData[areaName]; // Remove the area from state
                return updatedData;
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const groupedForecasts = areaMetadata
        .filter(area => aTableData[area.name])
        .map(area => {
            const areaForecasts = forecasts.flatMap(forecast =>
                forecast.forecasts
                    .filter(f => f.area === area.name)
                    .map(f => ({
                        timestamp: forecast.timestamp,
                        forecast: f.forecast,
                    }))
            );
            return {
                ...area,
                forecasts: areaForecasts,
            };
        });

    return (
        <>
            <h2>{new Date(timestamp).toLocaleString()}</h2>
            <div className="card-container">
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
                            <button className="delete-button" onClick={() => handleDelete(area.name)}>Delete</button>
                        ) : (
                            <button className="add-button" onClick={() => handleAdd(area.name)}>Add</button>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

export const saveAreaName = async (areaName) => {
    const url = `${import.meta.env.VITE_API_URL_AIRTABLE_2HRS}`;
    const urlKey = `${import.meta.env.VITE_APIKEY_AIRTABLE}`;
    const payload = {
        fields: {
            name: areaName
        },
    };
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${urlKey}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json.records.map((record) => ({
            ...record.fields,
        }));
    } catch (error) {
        console.error(error.message);
    }
};


0
: 
{id: 'rec75TpHDGOfyuxHG', name: 'Bedok'}
1
: 
{id: 'recD3XqSXQL7cNcRu', name: 'Bishan'}