// components/Sidebar.js

import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, IconButton, styled } from '@mui/material';
import MuiSwipeableDrawer from '@mui/material/SwipeableDrawer';
import ProfileIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

const StyledSwipeableDrawer = styled(MuiSwipeableDrawer)({
    overflowX: 'hidden',
    transition: 'width .25s ease-in-out',
    '& ul': {
      listStyle: 'none'
    },
    '& .MuiListItem-gutters': {
      paddingLeft: 4,
      paddingRight: 4
    },
    '& .MuiDrawer-paper': {
      left: 'unset',
      right: 'unset',
      overflowX: 'hidden',
      transition: 'width .25s ease-in-out, box-shadow .25s ease-in-out'
    }
  });

const Sidebar = ({ hidden, navHover, isSidebarOpen, setMobileNavVisible, toggleNavVisibility, setNavHover, handleSignOut, mobileNavVisible }) => {
  // Drawer Props for Mobile & Tablet screens
  const MobileDrawerProps = {
    open: mobileNavVisible,
    onOpen: () => toggleNavVisibility(true),
    onClose: () => toggleNavVisibility(false),
    ModalProps: {
      keepMounted: true,
    },
  };

  // Drawer Props for Laptop & Desktop screens
  const DesktopDrawerProps = {
    open: isSidebarOpen,
    onOpen: () => setMobileNavVisible(true),
    onClose: () => setMobileNavVisible(false),
    onMouseEnter: () => setNavHover(true),
    onMouseLeave: () => setNavHover(false),
  };

  return (
    <>
      {hidden && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleNavVisibility}
          sx={{ mr: 2, display: { sm: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <StyledSwipeableDrawer
        variant={hidden ? 'temporary' : 'permanent'}
        {...(hidden ? { ...MobileDrawerProps } : { ...DesktopDrawerProps })}
        PaperProps={{
          sx: {
            width: hidden ? '50vw' : (navHover ? 240 : 50),
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: 'width .25s ease-in-out, box-shadow .25s ease-in-out',
          },
        }}
      >
        <List>
          <ListItem button>
            <ListItemIcon><ProfileIcon /></ListItemIcon>
            <ListItemText primary="Profile" sx={{ display: isSidebarOpen ? 'block' : 'none' }} />
          </ListItem>
          <ListItem button onClick={handleSignOut}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Sign Out" sx={{ display: isSidebarOpen ? 'block' : 'none' }} />
          </ListItem>
        </List>
      </StyledSwipeableDrawer>
    </>
  );
};

export default Sidebar;
