import React, { PropsWithChildren, createContext, useMemo, useReducer } from 'react';
import { authReducer } from './reducers';

export type InitialStateType = {
    clientId: string;
    authServerUrl: string;
    isAuthenticated: boolean,
    user: any,
    defaultPlant: string,
    defaultPlantCurrency: string,
    token: any,
    menuAccessObject: any,
    defaultPlantName: string
}

export const initialAuthState: InitialStateType = {
    clientId: '',
    authServerUrl: '',
    isAuthenticated: false,
    user: {
        userName: 'Bhanuteja Reddy'
    },
    defaultPlant: 'SRPL',
    defaultPlantCurrency: 'USD',
    defaultPlantName: "SAII Resources Pvt Ltd",
    token: null,
    menuAccessObject: [],
}

interface IAMClientAuthContextType {
    IAMClientAuthContext: InitialStateType;
    dispatch: React.Dispatch<any>;
}
interface AuthContextProps {
    children: React.ReactNode;
}

const IAMClientContext = createContext<IAMClientAuthContextType>({
    IAMClientAuthContext: initialAuthState,
    dispatch: () => null
});

interface AuthContextProps {
    children: React.ReactNode;
    authServerUrl: string;
    clientId: string;
}

const IAMClientProvider: React.FC<PropsWithChildren<AuthContextProps>> = ({
    clientId,
    authServerUrl,
    children,
}: {
    children: React.ReactNode;
    authServerUrl: string;
    clientId: string;
}) => {
    const existing = JSON.parse(localStorage.getItem('currentUser')) || {}
    const [IAMClientAuthContext, dispatch] = useReducer(authReducer, { ...initialAuthState, ...existing, clientId, authServerUrl });

    const value = useMemo(() => ({ IAMClientAuthContext, dispatch }), [IAMClientAuthContext]);

    return <IAMClientContext.Provider value={value}>{children}</IAMClientContext.Provider>;
};

const useIAMClientState = () => {
    const context = React.useContext(IAMClientContext);
    if (context === undefined) {
        throw new Error("useIAMClientState must be used within a IAMClientProvider");
    }
    return context;
}

export { IAMClientProvider, IAMClientContext, useIAMClientState };
