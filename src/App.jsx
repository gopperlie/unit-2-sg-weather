import { useState } from 'react';

export default function App () {
    
        const [weather,setWeather] = useState([]);
// const cors = require("cors");
// ErpTable.use(cors());
    async function getData() {
        const url = "https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast";
        try {
          const response = await fetch(url, {}
          );
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }
        
          const json = await response.json();
          console.log(json);
        //   return json.records.map((record) => {
        //     return {
        //       id: record.id,
        //       ...record.fields,
        //     };
        //   });
        } catch (error) {
          console.error(error.message);
        }
      }
      const handleLoad = () => {
        getData();
      };

    // Step 3: Render the Table
    return (
        <>
        <button onClick={handleLoad}>Load</button>
        <table>
            <thead>
                <tr>
                    <th>Vehicle Type</th>
                    <th>DayType</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Zone ID</th>
                    <th>Charge</th>
                </tr>
            </thead>
            <tbody>
               
                    <tr>
                       
                        
                    </tr>
                
            </tbody>
        </table>
        </>
    )}