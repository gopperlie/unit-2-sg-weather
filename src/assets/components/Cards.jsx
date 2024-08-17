
import { Card, Button, Space } from 'antd';

export function ForecastCard ({ area, aTableData, handleAdd, handleDelete }) {

return (
  <Card 
  title={area.name}
  bordered={true}
  className="card"
>
  <p>Latitude: {area.latitude}, Longitude: {area.longitude}</p>
  {area.forecasts.map((f, i) => (
    <div key={i}>
      <p>Forecast: {f.forecast}</p>
    </div>
  ))}
  <Space>
    <Button
      type="primary"
      className="add-button"
      disabled={aTableData[area.name]}
      onClick={() => handleAdd(area.name)}
    >
      Add to Home
    </Button>
    <Button
      type="primary"
      className="delete-button"
      disabled={!aTableData[area.name]}
      onClick={() => handleDelete(area.name)}
    >
      Remove
    </Button>
  </Space> 
</Card>
);
}

export function HomepageCard ({area}) {

  return (
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
                ))}</Card>
  )
}