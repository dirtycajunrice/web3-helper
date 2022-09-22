import { ListItemButton } from '@mui/material';
import React, { FC, MouseEvent, KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import { ImportExport, AutoStories, TransferWithinAStation, PendingActions } from '@mui/icons-material';

import List from '@mui/material/List';

import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { NavLink } from 'react-router-dom';


interface AppDrawerProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const AppDrawer: FC<AppDrawerProps> = ({open, setOpen}) => {

  const toggleDrawer = (o: boolean) =>
      (event: KeyboardEvent | MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as KeyboardEvent).key === 'Tab' ||
           (event as KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setOpen(o)
      };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          <ListItemButton component={NavLink} to='/'>
            <ListItemIcon>
              <ImportExport />
            </ListItemIcon>
            <ListItemText primary='Token Import' />
          </ListItemButton>
          <ListItemButton component={NavLink} to='/eternal-pages'>
            <ListItemIcon>
              <AutoStories />
            </ListItemIcon>
            <ListItemText primary='Pages Transfer' />
          </ListItemButton>
          <ListItemButton component={NavLink} to='/batch-transfer'>
            <ListItemIcon>
              <TransferWithinAStation />
            </ListItemIcon>
            <ListItemText primary='NFT Batch Transfer' />
          </ListItemButton>
          <ListItemButton component={NavLink} to='/dex-aggregator'>
            <ListItemIcon>
              <PendingActions />
            </ListItemIcon>
            <ListItemText primary='Dex Aggregator' />
          </ListItemButton>
          <ListItemButton component={NavLink} to='/synapse'>
            <ListItemIcon>
              <PendingActions />
            </ListItemIcon>
            <ListItemText primary='Synapse Pending' />
          </ListItemButton>
          <ListItemButton component={NavLink} to='/sign-message'>
            <ListItemIcon>
              <PendingActions />
            </ListItemIcon>
            <ListItemText primary='Sign Message' />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}

export default AppDrawer