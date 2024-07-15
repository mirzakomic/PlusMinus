import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
    return useContext(LoadingContext);
};

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const setLoading = (state) => {
        setIsLoading(state);
    };

    return (
        <LoadingContext.Provider value={{ isLoading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};