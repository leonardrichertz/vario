// import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
// import CircularProgress from '@mui/material/CircularProgress';
// import HomePage from './public/page';
// import OrientationInfo from './public/orientationInfo';
import OrientationSensorApp from './public/page';
// import HelloWorld from './public/test';
const router = createBrowserRouter([
    {
      path: "/",
      element: <OrientationSensorApp />,
    //   children: [
    //     {
    //       path: "dashboard",
    //       element: <Dashboard />,
    //     },
    //     {
    //       path: "about",
    //       element: <About />,
    //     },
    //   ],
    },
  ]);

export default router;
  