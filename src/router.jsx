import { createHashRouter } from 'react-router-dom'; // Import createHashRouter instead of createBrowserRouter
import OrientationSensorApp from './public/page';

const router = createHashRouter([
    {
      path: "/",
      element: <OrientationSensorApp />,
    },
]);

export default router;
