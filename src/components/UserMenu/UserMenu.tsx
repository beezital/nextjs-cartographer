import { AuthContext } from "@/contexts/AuthContext";
import { AccountCircle } from "@mui/icons-material";
import { useMediaQuery, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";

export default function UserMenu() {

  const { user, login, logout } = useContext(AuthContext);

  const isDesktop = useMediaQuery('(min-width:600px)'); // TODO: DRY
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function loginAndClose() {
    handleClose();
    login();
  }

  return (
    <>
      {user ? (
        <div>
          {isDesktop ? (
            <Button
              variant="contained"
              size="large"
              disableElevation
              startIcon={<AccountCircle />}
              onClick={handleMenu}
              sx={{ textTransform: 'none' }}
            >
              {user.displayName}
            </Button>
          ) : (
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          )}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>{user.displayName}</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </div>
      ) : (
        <Button color="inherit" onClick={loginAndClose} >Login</Button>
      )}
    </>
  )
}