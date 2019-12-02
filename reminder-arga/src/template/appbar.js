import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import NotificationsIcon from '@material-ui/icons/Notifications'
import { Icon } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

export default function MainAppBar() {

    const classes = useStyles();

    return (
        <AppBar position="static">
            <Toolbar>
            <NotificationsIcon />
            <Typography variant="h6" className={classes.title} align="left">
                Reminder
            </Typography>
            <IconButton className={classes.menuButton} color="inherit" aria-label="settings">
                <SettingsIcon />
            </IconButton>
            </Toolbar>
        </AppBar>
    )
}