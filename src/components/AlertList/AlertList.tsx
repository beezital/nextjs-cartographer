import { AlertsContext } from "@/contexts/AlertsContexts";
import { useContext } from "react";
import { Alert } from '@mui/material';

import styles from './AlertList.module.css';

export default function AlertList() {

  const { alerts, removeAlert } = useContext(AlertsContext);

  return (
    <div className={styles.alertList}>
      {alerts.map((alert) => (
        <Alert
          key={alert.id} variant="filled" severity={alert.severity}
          onClose={() => { removeAlert(alert.id); }}>
          {alert.message}
        </Alert>
      ))}
    </div>
  );
}