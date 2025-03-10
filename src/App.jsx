import React from 'react';
import { useRoutes } from 'react-router-dom';
import ConnectPage from './pages/ConnectPage';
import HomePage from './pages/HomePage';

function App() {
  let routes = useRoutes([
    { path: '/connect', element: <ConnectPage /> },
    { path: '/', element: <HomePage /> }
  ]);

  return routes;
}


export default App;
