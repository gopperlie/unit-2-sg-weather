import { useState, useEffect } from 'react';

export default function Rainfall() {
    const [rainfallData, setRainfallData] = useState([]);
    const [stations, setStations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function getRainfall() {
        const url = "https://api-open.data.gov.sg/v2/real-time/api/rainfall";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            // console.log(json);
            // Map the stations data
            const stations = json.data.stations.map(station => ({
                id: station.id,
                name: station.name,
                latitude: station.location.latitude,
                longitude: station.location.longitude
            }));

            //Map the rainfall data
            const rainfallData = json.data.readings.flatMap(reading => ({
                timestamp: reading.timestamp,
                data: reading.data.map(dat => ({
                    stationId: dat.stationId,
                    value: dat.value,
                }))
            }));


            return { stations, rainfallData };

        } catch (error) {
            console.error(error.message);
            return [];
        }
    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const { rainfallData, stations } = await getRainfall();
            setStations(stations);
            setRainfallData(rainfallData);
          } catch (error) {
            console.error(error.message);
          } finally {
            setIsLoading(false);
          }
        };

        fetchData();
    }, []);
    if (isLoading) {
        return <div>等一下..</div>;
    }
    const groupedRainfalls = stations.map(id => {
        const values = readings.flatMap(reading =>
            reading.readings.filter(r => r.stationId === stations.id).map(f => ({
                stationsId: stations.id,
                value: r.value,
            }))
        );
        return {
            ...area,
            forecasts: areaForecasts,
        };
    });

    //render the data
    return (
        <>
        <p>Rain</p>
        </>
    );
}
