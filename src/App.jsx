import  { useState } from 'react';

const App = () => {
    const [sensorData] = useState({
        alpha: null,
        beta: null,
        gamma: null
    });

    return (
        <div className="orientation-app">
            <h1>Orientation Sensor Data changed five times!</h1>
            <div>
                <p>Alpha: {sensorData.alpha !== null ? sensorData.alpha.toFixed(2) : 'N/A'}</p>
                <p>Beta: {sensorData.beta !== null ? sensorData.beta.toFixed(2) : 'N/A'}</p>
                <p>Gamma: {sensorData.gamma !== null ? sensorData.gamma.toFixed(2) : 'N/A'}</p>
            </div>
        </div>
    );
};
export default App;
