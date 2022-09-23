import { ListItemButton } from '@mui/material';
import React, { MouseEvent, KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import { ImportExport, AutoStories, TransferWithinAStation, PendingActions } from '@mui/icons-material';

import List from '@mui/material/List';

import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@state/hooks';
import { selectUiComponentNavDrawerActive } from '@state/ui/hooks';
import { setUiComponent } from '@state/ui/reducer';
import { Component } from '@state/ui/types';

const AppDrawer = () => {
  const open = useAppSelector(selectUiComponentNavDrawerActive);
  const dispatch = useAppDispatch();

  const close = () =>
      (event: KeyboardEvent | MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as KeyboardEvent).key === 'Tab' ||
           (event as KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        dispatch(setUiComponent(Component.None));
      };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => dispatch(setUiComponent(Component.None))}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={close}
        onKeyDown={close}
      >
        <List>
          <ListItemButton component={NavLink} to='/'>
            <ListItemIcon>
              <ImportExport />
            </ListItemIcon>
            <ListItemText primary='Token Import' />
          </ListItemButton>
          <ListItemButton component={NavLink} to='/erc1155-transfer'>
            <ListItemIcon>
              <AutoStories />
            </ListItemIcon>
            <ListItemText primary='ERC1155 Transfer' />
          </ListItemButton>
          <ListItemButton component={NavLink} to='/batch-transfer'>
            <ListItemIcon>
              <TransferWithinAStation />
            </ListItemIcon>
            <ListItemText primary='NFT Batch Transfer' />
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