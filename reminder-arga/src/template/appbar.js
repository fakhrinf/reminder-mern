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
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import axios from 'axios'

const http = axios.create({
  baseURL: "http://localhost:3001/api"
})

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
      settingid: 0,
      receiveremail: "",
      sendtime: "",
      open: false,
      opensnackbar: false,
      snackmessage: "",
      alerttype: "success"
    }

    this.handleChange = this.handleChange.bind(this)

    this.getSettingData()
  }

  getSettingData = () => {
    http.get("/settings").then(data => {
      if(data.status == 200) {
        const dt = data.data[0]      
        this.setState({ settingid: dt._id, receiveremail: dt.receiveremail, sendtime: dt.sendtime })
      }
    }).catch(err => console.log(err))
  }

  componentWillUnmount() {
    this.setState({ open: false })
  }

  handleChange = (event) => {
    const value = event.target.value
    const name = event.target.name

    this.setState({ [name]: value })
  }

  handleClose = () => {
    this.setState({
      open: (this.state.open) ? false : true,
    })
  }

  handleSnackClose = (event, reason) => {
    if(reason === "clickaway") {
      return
    }

    this.setState({
      opensnackbar: (this.state.opensnackbar) ? false : true,
    })
  }

  manageSetting = () => {
    if(this.state.settingid == 0) {
      http.post("/settings", {
        "sendtime": this.state.sendtime,
        "receiveremail": this.state.receiveremail,
      }).then(data => {
        this.setState({opensnackbar: true, snackmessage: data.statusText, alerttype: "success"})
      }).catch(err => {
        this.setState({opensnackbar: true, snackmessage: err, alerttype: "error"})
      })
    }else{
      http.put(`/settings/${this.state.settingid}`, {
        "sendtime": this.state.sendtime,
        "receiveremail": this.state.receiveremail,
      }).then(data => {
        this.setState({opensnackbar: true, snackmessage: data.statusText, alerttype: "success"})
      }).catch(err => {
        this.setState({opensnackbar: true, snackmessage: err, alerttype: "error"})
      })
    }

    this.handleClose()
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
            <IconButton onClick={this.handleClose} color="inherit" className={classes.menuButton} aria-label="settings">
                <SettingsIcon />
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
              id="receiveremailid"
              name="receiveremail"
              label="Email Address"
              type="email"
              onChange={this.handleChange}
              value={(this.state.receiveremail) ? this.state.receiveremail : ""}
              fullWidth
            />

            <DialogContentText>
              Set when email will be sent.
            </DialogContentText>
            <TextField
              name="sendtime"
              margin="dense"
              id="sendtimeid"
              label="Time in 24 Hour format"
              type="number"
              onChange={this.handleChange}
              value={(this.state.sendtime) ? this.state.sendtime : ""}
              fullWidth
            />
            <input type="hidden" value={this.state.settingid} id="settingid" name="id" />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.manageSetting} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          className="success"
          open={this.state.opensnackbar}
          autoHideDuration={5000}
          onClose={this.handleSnackClose}
        >
          <SnackbarContent
            aria-describedby="client-snackbar"
            message={
              <span id="client-snackbar">
                {this.state.snackmessage}
              </span>
            }
            action={[
              <IconButton key="close" aria-label="close" color="inherit" onClick={this.handleSnackClose}>
                <CloseIcon />
              </IconButton>
            ]}
          />
        </Snackbar>

      </div>
    )
  }
}

export default withStyles(useStyles, {withTheme: true}) (MainAppBar)