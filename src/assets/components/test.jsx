{
    "code": 0,
    "data": {
      "stations": [
        {
          "id": "S218",
          "deviceId": "S218",
          "name": "Bukit Batok Street 34",
          "location": {
            "latitude": 1.36491,
            "longitude": 103.75065
          }
        },
        
      ],
      "readings": [
        {
          "timestamp": "2024-08-13T16:25:00+08:00",
          "data": [
            {
              "stationId": "S218",
              "value": 0
            },
            ]
        }
      ],
      "readingType": "TB1 Rainfall 5 Minute Total F",
      "readingUnit": "mm"
    },
    "errorMsg": ""
  }

//   const groupedForecasts = areaMetadata.map(area => {
//     const areaForecasts = forecasts.flatMap(forecast =>
//         forecast.forecasts.filter(f => f.area === area.name).map(f => ({
//             timestamp: forecast.timestamp,
//             forecast: f.forecast,
//         }))
//     );
//     return {
//         ...area,
//         forecasts: areaForecasts,
//     };

  const [areaMetadata, setAreaMetadata] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
        
        // Mapping area_metadata
        const areaMetadata = json.data.area_metadata.map(area => ({
            name: area.name,
            latitude: area.label_location.latitude,
            longitude: area.label_location.longitude
        }));
        
        // Mapping forecasts
        const forecasts = json.data.items.flatMap(item => ({
            timestamp: item.timestamp,
            forecasts: item.forecasts.map(forecast => ({
                area: forecast.area,
                forecast: forecast.forecast
            }))
        }));
        
        return { areaMetadata, forecasts };
    } catch (error) {
        console.error(error.message);
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