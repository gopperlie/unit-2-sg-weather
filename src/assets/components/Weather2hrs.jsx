import { useState,useEffect } from 'react';

export default function Weather2hrs () {
    
    const [areaMetadata, setAreaMetadata] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const [timestamp, setTimestamp] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
// const cors = require("cors");
// ErpTable.use(cors());
async function getDataAndMapProperties() {
    //remember to park all these URL services into 1 file later
    const url = "https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast";
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
        
        // Mapping area_metadata
        const areaMetadata = json.data.area_metadata.map(area => ({
            name: area.name,
            latitude: area.label_location.latitude,
            longitude: area.label_location.longitude
        }));
        
        // Mapping forecasts
        const forecasts = json.data.items.flatMap(item => ({
            // timestamp: item.timestamp,
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
//pull API on page load
useEffect(() => {
    const fetchData = async () => {
      try {
        const { areaMetadata, forecasts } = await getDataAndMapProperties();
        setAreaMetadata(areaMetadata);
        setForecasts(forecasts);
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
            timestamp: forecast.timestamp,
            forecast: f.forecast,
        }))
    );
    return {
        ...area,
        forecasts: areaForecasts,
    };
});

// Render the data
return (
    <div><h2>{new Date(timestamp).toLocaleString()}</h2>
        {groupedForecasts.map((area, index) => (
            <div key={index} className="card">
                <h3>{area.name}</h3>
                <p>Latitude: {area.latitude}, Longitude: {area.longitude}</p>
                {area.forecasts.map((f, i) => (
                    <div key={i}>
                        {/* <h4>Date & Time: {new Date(f.timestamp).toLocaleString()}</h4> */}
                        <p>Forecast: {f.forecast}</p>
                    </div>
                ))}
            </div>
        ))}
    </div>
);
}