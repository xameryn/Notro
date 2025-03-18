import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ServerProvider } from './contexts/ServerContext';
import { FileRefsProvider } from './contexts/FileRefsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ServerProvider>
      <FileRefsProvider>
      <App />
      </FileRefsProvider>
      </ServerProvider>
    </BrowserRouter>
  </React.StrictMode>
);

