import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './task.css';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import moment from 'moment';

// all todo
class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {tasks: [],visible: false};
    this.handleDelete = this.handleDelete.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    this.getTasks();
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
  getCookie (name) {
    var value = '; ' + document.cookie
    var parts = value.split('; ' + name + '=')
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  handleDelete(id){
    var deleteTask = {
      method: "DELETE",
      headers: {
        "Accept": "text/html; q=1.0, */*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-CSRFToken": this.getCookie('csrftoken')
      }
    }
    fetch("task/"+id+"/", deleteTask)
    .then(response => response.status)
    .then(status => {
      if(status === 200){
        var newTasks = [];
        for(let i=0;i<this.state.tasks.length;i++){
          if (this.state.tasks[i].id !== id){
            newTasks.push(this.state.tasks[i]);
          }
        }
        this.setState({tasks:newTasks})
      }
    })
  }

  handleComplete(data){
    var completeTask = {
      method: "PUT",
      headers: {
        "Accept": "text/html; q=1.0, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": this.getCookie('csrftoken')
      },
      body: JSON.stringify({
        "id": data.id,
        "content": data.content,
        "expire_date": data.expire_date,
        "status": 1,
        "priority": data.priority
      })
    }
    fetch("task/"+data.id+"/", completeTask).then(response => response.status)
    .then(status => {
      if(status === 200){
        var newTasks = [];
        for(let i=0;i<this.state.tasks.length;i++){
          if (this.state.tasks[i].id !== data.id){
            newTasks.push(this.state.tasks[i]);
          }else{
            var t = this.state.tasks[i];
            t.status = 1;
            newTasks.push(t);
          }
        }
        this.setState({tasks:newTasks})
      }
    })
  }

  
  updateState(newTasks){
    this.setState({tasks: newTasks});
  }

  render() {
    let taskItems = this.state.tasks.map(item => {
      return <TaskItem completeTask={this.handleComplete} deleteTask={this.handleDelete} updateItemState={this.updateState} key={item.id} data={item} tasks={this.state.tasks} />
    })
    return (
      <div>
        <TaskForm updateListState={this.updateState} tasks={this.state.tasks}/>
        <div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>内容</th>
                <th>截止时间</th>
                <th>状态</th>
                <th>优先级</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {taskItems}
            </tbody>
          </table>
        </div>
      </div>  
    );
  }
}

export default TaskList;