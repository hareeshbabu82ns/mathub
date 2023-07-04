import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import ListSubheader from '@mui/material/ListSubheader';
import AritmeticIcon from '@mui/icons-material/CalculateOutlined';
import DashIcon from '@mui/icons-material/DashboardOutlined';
import { Link } from 'react-router-dom'

export const mainListItems = (
  <div>
    <ListItem component={Link} to="/">
      <ListItemIcon>
        <DashIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem component={Link} to="/arithmetic">
      <ListItemIcon>
        <AritmeticIcon />
      </ListItemIcon>
      <ListItemText primary="Arithmetic Test" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    {/* <ListSubheader inset>Saved Searches</ListSubheader> */}
  </div>
);