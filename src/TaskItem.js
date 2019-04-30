import React from 'react';
import DatePicker from 'react-datepicker';
import { Modal, } from 'antd';
import moment from 'moment';

class TaskItem extends React.Component{
  constructor(props) {
    super(props);
    var expireDateStr = this.props.data.expire_date;
    expireDateStr = expireDateStr.replace(/-/g,"/");
    this.state={
      visible: false,
      selectedId: '',
      expire_date: new Date(expireDateStr),
      priority: this.props.data.priority,
      content: this.props.data.content,
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  getCookie (name) {
    var value = '; ' + document.cookie
    var parts = value.split('; ' + name + '=')
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  handleOk() {
    var updateTask = {
      method: "PUT",
      headers: {
        "Accept": "text/html; q=1.0, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": this.getCookie('csrftoken')
      },
      body: JSON.stringify({
        "id": this.props.data.id,
        "create_date": this.props.data.create_date,
        "content": this.state.content,
        "expire_date": moment(this.state.expire_date).format('YYYY-MM-DD'),
        "status": this.props.data.status,
        "priority": this.state.priority,
      })
    }
    fetch("task/"+this.props.data.id+"/", updateTask)
    var newTasks = [];
    for(var i=0; i<this.props.tasks.length;i++){
      if(this.props.tasks[i].id !== this.props.data.id){
        newTasks.push(this.props.tasks[i]);
      }else{
        var updateTask = new Object();
        updateTask.id = this.props.data.id;
        updateTask.create_date = this.props.data.create_date;
        updateTask.content = this.state.content;
        updateTask.expire_date = moment(this.state.expire_date).format('YYYY-MM-DD');
        updateTask.status = this.props.data.status;
        updateTask.priority = this.state.priority;
        newTasks.push(updateTask);
      }
    }
    this.setState({visible: false});
    this.props.updateItemState(newTasks);
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleContentChange(event){
    this.setState({content: event.target.value})
  }

  handleDateChange(date) {
    this.setState({expire_date: date})
  }

  handleSelect(event) {
    this.setState({priority: event.target.value});
  }

  render(){
      let {content, expire_date,status,priority}=this.props.data;
      return (
          <tr>
              <td>{content}</td>
              <td>{expire_date}</td>
              <td>{status===0?"未完成":"完成"}</td>
              <td>{priority}</td>
              <td>
                  <a className="btn btn-primary" onClick={this.showModal}>编辑</a>
                  <a className="btn btn-primary" onClick={() => this.props.deleteTask(this.props.data.id)}>删除</a>
                  <a className="btn btn-success" onClick={() => this.props.completeTask(this.props.data)}>
                    <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                      完成
                  </a>
              </td>
              <td>
                <Modal title="todo" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} centered>
                  <input ref="newContent"  type="text" defaultValue={content} onChange={this.handleContentChange}/>
                  <DatePicker ref="newExpireDate" selected={this.state.expire_date} onChange={this.handleDateChange} dateFormat="yyyy-MM-dd" />
                  <select ref="newPriority" defaultValue={priority} onChange={this.handleSelect}>
                    <option value="0">不重要</option>
                    <option value="1">一般</option>
                    <option value="2">重要</option>
                    <option value="3">紧急</option>
                  </select>
                </Modal>
              </td>
          </tr>
      );
  }
}

export default TaskItem;