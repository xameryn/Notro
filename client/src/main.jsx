import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { ServerProvider } from './contexts/ServerContext';
import { FileRefsProvider } from './contexts/FileRefsContext';
export const API_BASE_URL = 'http://localhost:4000';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ServerProvider>
          <FileRefsProvider>
            <App/>
          </FileRefsProvider>
        </ServerProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

