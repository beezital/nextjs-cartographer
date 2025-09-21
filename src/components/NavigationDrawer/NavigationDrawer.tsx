import { useContext, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import { AuthContext } from '@/contexts/AuthContext';
import styles from './NavigationDrawer.module.css';
import { getMessagingToken } from '@/lib/firebase';

const drawerWidth = 240;

export default function NavigationDrawer({ isDrawerOpen, toggleDrawer }: { isDrawerOpen: boolean, toggleDrawer: () => void }) {

  const isDesktop = useMediaQuery('(min-width:600px)'); // https://www.browserstack.com/guide/responsive-design-breakpoints
  const { canCreateGroup } = useContext(AuthContext);

  useEffect(() => {
    getMessagingToken();
  }, []);
  
  return (
    <>
      <div className={styles.drawerOverlay} style={{ display: !isDesktop && isDrawerOpen ? "block" : "none" }} onClick={toggleDrawer}></div>
      <div className={styles.drawer} style={{ width: drawerWidth, marginLeft: isDrawerOpen ? 0 : -drawerWidth }}>
        <span>App Navigation Drawer</span>
        {canCreateGroup && <div><button>Create Group</button></div>}
        {!canCreateGroup && <div>You must be logged in to create groups</div>}
      </div>
    </>
  );
}