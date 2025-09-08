import { createContext, ReactNode, useCallback, useState } from "react";


export enum AlertSeverity {
    Error = 'error',
    Warning = 'warning',
    Info = 'info',
    Success = 'success',
}

export type Alert = {
    id: number;
    message: string;
    severity: AlertSeverity;
};

export const AlertsContext = createContext<{
    alerts: Alert[],
    addError: (message: string) => void,
    removeAlert: (id: number) => void
}>({
    alerts: [],
    addError: () => { },
    removeAlert: () => { },
});


export function AlertsProvider({ children }: { children: ReactNode }) {

    const [alerts, setAlerts] = useState<Alert[]>([]);

    const addAlert = useCallback((message: string, severity: AlertSeverity) => {
        const id = Date.now();
        setAlerts((prevAlerts) => [...prevAlerts, { id, message, severity }]);
    }, []);

    function removeAlert(id: number) {
        setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }

    const addError = useCallback((message: string) => {
        addAlert(message, AlertSeverity.Error);
    }, [addAlert]);

    return (
        <AlertsContext.Provider value={{ alerts, addError, removeAlert }}>
            {children}
        </AlertsContext.Provider>
    );
}
