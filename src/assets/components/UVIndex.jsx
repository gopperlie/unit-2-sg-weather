import { useState, useEffect } from 'react';

export default function UVIndex() {
    const [UVIndex, setUVIndex] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function getUVIndex() {
        const url = `${import.meta.env.VITE_API_URL_UVI}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();

            // Map the UV index data
            const UVIndex = json.data.records.map(record => ({
                timestamp: record.timestamp,
                index: record.index.map(ix => ({
                    hour: ix.hour,
                    value: ix.value,
                })),
            }));

            return UVIndex;

        } catch (error) {
            console.error(error.message);
            return [];
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const uvIndexData = await getUVIndex();
                setUVIndex(uvIndexData); // Set the state with the UV index data
            } catch (error) {
                console.error(error.message);
            } finally {
                setIsLoading(false); // Set loading to false once done
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <div>Hang in there..</div>;
    }

    return (
        //maybe map the data onto a line chart
        <div>
            <h2>UV Index</h2>
            {UVIndex.map((record, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                    <h3>Timestamp: {new Date(record.timestamp).toLocaleString()}</h3>
                    <div>
                        {record.index.map((item, idx) => (
                            <div key={idx}>
                                <p>Hour: {new Date(item.hour).toLocaleString()}</p>
                                <p>Value: {item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
