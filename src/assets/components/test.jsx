// {
//     "code": 0,
//     "data": {
//       "stations": [
//         {
//           "id": "S218",
//           "deviceId": "S218",
//           "name": "Bukit Batok Street 34",
//           "location": {
//             "latitude": 1.36491,
//             "longitude": 103.75065
//           }
//         },
        
//       ],
//       "readings": [
//         {
//           "timestamp": "2024-08-13T16:25:00+08:00",
//           "data": [
//             {
//               "stationId": "S218",
//               "value": 0
//             },
//             ]
//         }
//       ],
//       "readingType": "TB1 Rainfall 5 Minute Total F",
//       "readingUnit": "mm"
//     },
//     "errorMsg": ""
//   }


  {
    "code": 0,
    "errorMsg": null,
    "data": {
      "area_metadata": [
        {
          "name": "Ang Mo Kio",
          "label_location": {
            "latitude": 1.375,
            "longitude": 103.839
          }
        }
      ],
      "items": [
        {
          "updated_timestamp": "2024-07-17T05:05:54.000Z",
          "timestamp": "2024-07-17T04:59:00.000Z",
          "valid_period": {
            "start": "2024-07-16T16:30:00.000Z",
            "end": "2024-07-16T18:30:00.000Z",
            "text": "12.30 am to 2.30 am"
          },
          "forecasts": [
            {
              "area": "Ang Mo Kio",
              "forecast": "Fair"
            }
          ]
        }
      ],
      "paginationToken": "b2Zmc2V0PTEwMA== (you will see this token only if next page exists)"
    }
  }
  const stationsWithReadings = json.data.stations.map(station => {
    const reading = json.data.readings[0].data.find(r => r.stationId === station.id);
    return {
        ...station,
        value: reading ? reading.value : 'N/A',
        readingUnit: json.data.readingUnit,
        timestamp: json.data.readings[0].timestamp, // Include timestamp
    };
});

  const [areaMetadata, setAreaMetadata] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
