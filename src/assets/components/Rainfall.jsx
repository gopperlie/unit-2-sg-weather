import { useState, useEffect } from 'react';

export default function StationReadings() {
    const [stationsData, setStationsData] = useState([]);
    const [timestamp, setTimestamp] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchData() {
        const url = "https://api-open.data.gov.sg/v2/real-time/api/rainfall";
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

            const extractedTimestamp = json.data.readings[0].timestamp;
            setTimestamp(extractedTimestamp);

            // Combine station data with readings
            const stationsWithReadings = json.data.stations.map(station => {
                const reading = json.data.readings[0].data.find(r => r.stationId === station.id);
                return {
                    ...station,
                    value: reading ? reading.value : 'N/A',
                    readingUnit: json.data.readingUnit,
                    timestamp: json.data.readings[0].timestamp,
                };
            });

            setStationsData(stationsWithReadings);
        } catch (error) {
            console.error(error.message);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return <div>等一下...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div><h2>{new Date(timestamp).toLocaleString()}</h2>
            {stationsData.map((station, index) => (
                <div key={index} style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '10px' }}>
                    <h3>Station ID: {station.id}</h3>
                    <p>Name: {station.name}</p>
                    <p>Reading Value: {station.value} {station.readingUnit}</p>
                </div>
            ))}
        </div>
    );
}
