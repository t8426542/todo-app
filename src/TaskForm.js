import React from 'react';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

class TaskForm extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      content: '',
      expire_date: '',
      status: 0,
      priority: 0,
    };
    this.handDateChange = this.handDateChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handCreate = this.handCreate.bind(this);
  }

  handSubmit(event) {
    console.log(event);
    event.preventDefault();
  }

  getCookie (name) {
    var value = '; ' + document.cookie
    var parts = value.split('; ' + name + '=')
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  handDateChange(date) {
    this.setState({expire_date: date})
  }

  handleSelect(event) {
    this.setState({priority: event.target.value});
  }

  handCreate() {
    var bodyData = JSON.stringify({
      "content": this.refs.content.value,
      "expire_date": moment(this.refs.expire_date.value).format('YYYY-MM-DD'),
      'status': 0,
      'priority': this.refs.priority.value
    });
    this.refs.content.value = '';
    this.refs.expire_date.value = '';
    var createTask = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.getCookie('csrftoken')
      },
      body: bodyData
    }
    fetch("task/", createTask).then(response => response.json())
    .then(data => {
      var newTasks = this.props.tasks;
      newTasks.push(data);
      this.props.updateListState(newTasks);
    })
    
  }

  render() {
    return (
      <form className="form-horizontal" id="addForm" onSubmit={this.handSubmit.bind(this)}>
        <div className="form-group">
            <div className="col-sm-8">
                <input ref="content"  type="text" className="form-control" id="taskContent" placeholder="input what to do" />
                <DatePicker ref="expire_date" selected={this.state.expire_date} onChange={this.handDateChange} dateFormat="yyyy-MM-dd" />
                <select ref="priority" defaultValue="0" onChange={this.handleSelect}>
                  <option value="0">不重要</option>
                  <option value="1">一般</option>
                  <option value="2">重要</option>
                  <option value="3">紧急</option>
                </select>
            </div>
            <div className="col-sm-2">
                <button type="button" className="btn btn-primary" onClick={this.handCreate} >add</button>
            </div>
        </div>
      </form>
    )
  }
}

export default TaskForm;