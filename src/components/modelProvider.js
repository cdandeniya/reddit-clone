import React from 'react';
import Model from '../models/model';

export const ModelContext = React.createContext(null);

export default function ModelProvider({ children }) {
    const [model] = React.useState(() => new Model());

    return (
        <ModelContext.Provider value={model}>
            {children}
        </ModelContext.Provider>
    );
}