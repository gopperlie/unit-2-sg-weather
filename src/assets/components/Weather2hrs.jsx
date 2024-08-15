import { useState,useEffect } from 'react';
import { get2hrAirtable,saveAreaName} from '../services/atableServices';
import '../css-scripts/cardscript.css';
import { Button, Card, Space, Col, Row } from 'antd';

export default function Weather2hrs () {
    
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
console.log(airtableRecords);
            // Transform airtable data for easy lookup
            const airtableDataMap = airtableRecords.reduce((acc, record) => {
                acc[record.name] = record.id; // for example: "Bishan": record.id
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


// const recordId = aTableData["Bishan"];
// console.log(recordId);
const handleAdd = async (areaName) => {
    try {
        const newRecord = await saveAreaName(areaName);
        console.log(newRecord);
       
        const recordId = newRecord.id;
        // Update the local airtable state to reflect the new entry in Airtable
        setATableData(oldData => ({
            ...oldData,
            [areaName]:recordId, // Mark this area as added
        }));
    } catch (error) {
        console.error(error.message);
    }
};

// Render the data
return (
    <>
    <h2>{new Date(timestamp).toLocaleString()}</h2>
    <Row gutter={20}>
    {/* <Space direction="vertical" size={16}> */}
            {groupedForecasts.map((area,index) => (
                <Col span={8} key={index}>
                    <Card 
            title={area.name}
            bordered={true}>
           <p>Latitude: {area.latitude}, Longitude: {area.longitude}</p>
           {area.forecasts.map((f, i) => (
                    <div key={i}>
                        <p>Forecast: {f.forecast}</p>
                    </div>
                ))}
                {aTableData[area.name] ? (
                    <Button type="primary" className="add-button" disabled onClick={() => handleAdd(area.name)}>Add</Button>
                    ) : (
                    <Button type="primary" className="add-button" onClick={() => handleAdd(area.name)}>Add</Button>
                )}
                {aTableData[area.name] ? (
                    <Button type="primary" className="delete-button" onClick={() => handleDelete(area.name)}>Remove</Button>
                ) : (
                    <Button type="primary" disabled className="delete-button" onClick={() => handleDelete(area.name)}>Remove</Button>   
                )}    
            </Card></Col>))}
            {/* </Space> */}
           </Row>
    </>
);
}