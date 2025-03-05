import React, { createContext, useContext, useState } from 'react';

const ServerContext = createContext(null);

export const useServer = () => useContext(ServerContext);

export const ServerProvider = ({ children }) => {
    const [selectedServer, setSelectedServer] = useState("Server 1");

    return (
        <ServerContext.Provider value={{ selectedServer, setSelectedServer }}>
            {children}
        </ServerContext.Provider>
    );
};
