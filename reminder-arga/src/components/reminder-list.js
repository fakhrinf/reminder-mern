import React from 'react';
import Container from '@material-ui/core/Container'
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import http from '../helper/api'

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} color="error" />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

class ReminderList extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      data : [],
      columns: [
        { title: 'Title', field: 'title' },
        { title: 'Description', field: 'desc' },
        { 
          title: 'Duedate', 
          field: 'duedate',
          editComponent: props => (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="none"
                id="date-picker-dialog"
                format="yyyy-MM-dd"
                value={props.value}
                onChange={e => props.onChange(e)}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          ) 
        },
        { title: 'Remind in', field: 'remindin', type: 'numeric' },
        {
          title: 'Type',
          field: 'type',
          lookup: { 'DOC': 'Document', 'BDAY': 'Birthday' },
        },
      ],
    }

    this.getdata()
  }

  getdata = () => {
    http.get("/reminder").then(data => {
      if(data.status === 200) {
        const json = data.data
        let reminder = []
        json.forEach(rm => {
          reminder.push({id: rm._id, title: rm.title, desc: rm.description, duedate: rm.duedate, remindin: rm.remindin, type: rm.type})
        })

        this.setState({ data: reminder })
        
      }
    }).catch(err => {
      console.log(err);
    })
  }

  componentWillUnmount() {
    this.setState({
      data : [],
    })
  }

  render() {
    return(
      <Container Style="margin-top:40px;margin-bottom:20px;">
        <MaterialTable
            icons={tableIcons}
            title="Reminder List"
            columns={this.state.columns}
            data={this.state.data}
            options={{
              actionsColumnIndex: 5
            }}
            editable={{
            onRowAdd: newData =>
                new Promise((resolve, reject) => {

                  http.post("/reminder", newData).then(rs => {
                    if(rs.status === 200) {
                      resolve()
                      this.setState(prevState => {
                        const data = [...prevState.data];
                        data.push(newData);
                        return { ...prevState, data };
                      });
                    }else{
                      reject()
                    }
                  }).catch(err => {
                    reject()
                    console.log(err);
                  });

                }),
            onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  http.put(`/reminder/${oldData.id}`, newData).then(rm => {
                    if(rm.status === 200) {
                      resolve();
                      if (oldData) {
                        this.setState(prevState => {
                            const data = [...prevState.data];
                            data[data.indexOf(oldData)] = newData;
                            return { ...prevState, data };
                        });
                      }
                    }else{
                      reject()
                    }
                  })
                }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                http.delete(`/reminder/${oldData.id}`).then(rm => {
                  if(rm.status === 200) {
                    resolve()
                    this.setState(prevState => {
                      const data = [...prevState.data];
                      data.splice(data.indexOf(oldData), 1);
                      return { ...prevState, data };
                      });
                  }else{
                    reject()
                  }
                }).catch(err => {
                  reject()
                })
              }),
            }}
          />
      </Container>
    )
  }
}

export default ReminderList