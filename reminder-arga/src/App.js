import React from 'react';
import './App.css';
import MainAppBar from './template/appbar'
import ReminderList from './components/reminder-list'

class App extends React.Component {
  
  

  render() {
    return(
      <div className="App">
        <MainAppBar/>
        <ReminderList/>
      </div>
    )
  }
}

export default App;
