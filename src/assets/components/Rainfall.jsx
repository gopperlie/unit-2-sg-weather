import { useState, useEffect } from 'react';
import { Button, Card, Space, Col, Row } from 'antd';

export default function StationReadings() {
    const [stationsData, setStationsData] = useState([]);
    const [timestamp, setTimestamp] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchData() {
        const url = `${import.meta.env.VITE_API_URL_RAINREADINGS}`;
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
        <>
        <h2>{new Date(timestamp).toLocaleString()}</h2>
         <Row gutter={[16,16]}>
            {stationsData.map((station, index) => (
                <Col span={8} key={index}>
                    <Card 
                    title={`Station ID: ${station.id}`}
                    bordered={true}>
                    <p>Name: {station.name}</p>
                    <p>Reading Value: {station.value} {station.readingUnit}</p>
                    </Card>
                    </Col>
            ))}    
        </Row>
        </>
    );
}
