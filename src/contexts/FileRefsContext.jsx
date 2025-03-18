import React, { createContext, useContext, useState } from 'react';

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
