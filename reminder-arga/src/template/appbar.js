import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import NotificationsIcon from '@material-ui/icons/Notifications'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios'

const useStyles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

class MainAppBar extends React.Component {
  
  constructor(props) {
    super(props)

    this.state = {
      settings: [],
      open: false
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.setState({ open: false })
  }

  handleClose = () => {
    this.setState({
      open: (this.state.open) ? false : true
    })
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <AppBar position="static">
            <Toolbar>
            <NotificationsIcon />
            <Typography variant="h6" className={classes.title} align="left">
                Reminder
            </Typography>
            <IconButton color="inherit" className={classes.menuButton} aria-label="settings">
                <SettingsIcon onClick={this.handleClose}/>
            </IconButton>
            </Toolbar>
        </AppBar>

        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Settings</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Set Email receipient. Divide email bi coma (,) if there are many receipient.
            </DialogContentText>
            <TextField
              autoFocus
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />

            <DialogContentText>
              Set when email will be sent.
            </DialogContentText>
            <TextField
              margin="dense"
              id="name"
              label="Time in 24 Hour format"
              type="number"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(useStyles, {withTheme: true}) (MainAppBar)