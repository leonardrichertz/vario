import React from 'react';
import { RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom';
import router from './router'; // Import router without the ".jsx" extension

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
