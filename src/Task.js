import React from 'react'
import TaskList from './TaskList'

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.ids = 1;
    this.state={
      tasks: []
    };
  }

  getCookie (name) {
    var value = '; ' + document.cookie
    var parts = value.split('; ' + name + '=')
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  getTasks() {
    var getTask = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    }
    fetch("task/", getTask)
    .then(response => response.json())
    .then(data => {
      this.setState({tasks: data.results})
    })
  }

  render(){
    return (
        <div className="container">
            <br/>
            <br/>
            <br/>
        <div className="panel panel-default">
            <div className="panel-headingbg-danger">
                    <h1 className="text-center ">ToDo<small>你要做什么？</small></h1>
                    <hr/>
            </div>
            <div className="panel-body">
                    <TaskList />
                </div>
            </div> 
        </div>
    );
}
}

export default Task;