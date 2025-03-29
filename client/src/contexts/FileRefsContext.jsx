import React, { createContext, useContext, useState } from 'react';

// Soon this entire context can be deleted (everything will be handled by ServerContext + UserContext)

const FileRefsContext = createContext(null);

export const useFileRefs = () => useContext(FileRefsContext);

export const FileRefsProvider = ({ children }) => {
    const [fileRefs, setFileRefs] = useState([]);

    return (
        <FileRefsContext.Provider value={{ fileRefs, setFileRefs }}>
            {children}
        </FileRefsContext.Provider>
    );
};
