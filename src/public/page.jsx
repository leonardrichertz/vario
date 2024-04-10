import React, { useEffect, useState } from 'react';

const OrientationSensorApp = () => {
    const [sensorData, setSensorData] = useState({
        alpha: null,
        beta: null,
        gamma: null
    });

    useEffect(() => {
        const handleOrientationChange = (event) => {
            setSensorData({
                alpha: event.alpha,
                beta: event.beta,
                gamma: event.gamma
            });
        };

        if ('DeviceOrientationEvent' in window) {
            console.log('Device Orientation Event is supported');
            try {
            window.addEventListener("deviceorientation", handleOrientationChange);
            console.log('Event listener added for Device Orientation Event');
            } catch (error) {
                console.error('Error adding event listener for Device Orientation Event: ', error);
            }
        } else {
            console.log('Device Orientation Event is not supported');
        }

        return () => {
            window.removeEventListener("deviceorientation", handleOrientationChange);
        };
    }, []); // Empty dependency array ensures the effect runs only once on mount

    return (
        <div className="orientation-app">
            <h1>Orientation Sensor Data</h1>
            <div>
                <p>Alpha: {sensorData.alpha !== null ? sensorData.alpha.toFixed(2) : 'N/A'}</p>
                <p>Beta: {sensorData.beta !== null ? sensorData.beta.toFixed(2) : 'N/A'}</p>
                <p>Gamma: {sensorData.gamma !== null ? sensorData.gamma.toFixed(2) : 'N/A'}</p>
            </div>
        </div>
    );
};

export default OrientationSensorApp;
