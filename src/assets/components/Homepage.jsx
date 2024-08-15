import { useState,useEffect } from 'react';
import { get2hrAirtable } from '../services/atableServices';
// import '../css-scripts/cardscript.css';
import { Card, Col, Row, Layout,theme } from 'antd';

const {Header } = Layout;


export default function Homepage () {
    
    const [areaMetadata, setAreaMetadata] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const [timestamp, setTimestamp] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [aTableData,setATableData] = useState([]);
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
            const airtableRecords = await get2hrAirtable();
            const { areaMetadata, forecasts } = await getDataAndMapProperties();
            setAreaMetadata(areaMetadata);
            setForecasts(forecasts);

            //Transform airtable data for easy lookup
            const airtableDataMap = airtableRecords.reduce((acc, record) => {
                acc[record.name] = true; // for example: "Bishan": true
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
const groupedForecasts = areaMetadata
.filter(area => aTableData[area.name]) // Only include areas that are in Airtable
.map(area => {
    const areaForecasts = forecasts
        .flatMap(forecast =>
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


// Render the data
return (
    <>    
    <Header style={{
        display: 'flex',
        alignItems: 'left',
        color: "white", // Change font color (e.g., Tomato color
        fontSize: '18px', // Change font size
        fontWeight: 'bold',
    }}
    >
   <h2> 2 hour forecasts: {new Date(timestamp).toLocaleString()}</h2></Header>
    <Row gutter={[16,16]}>
   
        {groupedForecasts.map((area, index) => (
            <Col span={8} key={index}>
                <Card
                title={area.name}
                bordered={true}
               className='card'            
                >
                <p>Latitude: {area.latitude}, Longitude: {area.longitude}</p>
                {area.forecasts.map((f, i) => (
                    <div key={i}>
                        <p>Forecast: {f.forecast}</p>
                    </div>
                ))}</Card></Col>
        ))}
    </Row>
</>
);
}