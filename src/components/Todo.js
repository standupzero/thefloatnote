import React from 'react';
import { v4 as uuidv4 } from 'uuid';


class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoItems: [],
      inputValue: "",
      finished: [],
    }   

  }



  handleSubmit = (e) => {
    e.preventDefault();
    let todoItems = this.state.todoItems;
    if (e.target.userInput.value == "") {
      return
    } 
    todoItems.push(e.target.userInput.value)
    this.setState({todoItems, inputValue: ""}, console.log(this.state))

  }

  handleInputchange = (e) => {
    e.preventDefault();
    let currentValue = e.target.value;
    this.setState({inputValue: currentValue});
  }

  handleDeleteItem = (e) => {
    let item = e.target.getAttribute("item");
    let indexOf = this.state.todoItems.indexOf(item);
    let tempSrc = this.state.todoItems;
    tempSrc.splice(indexOf, 1);
    this.setState({todoItems: tempSrc})
  }

  handleCheckItem = (e) => {
    
    e.stopPropagation();
    let item = e.target.getAttribute("item");
    console.log(item);
    let placeholder = this.state.finished;
    console.log(placeholder)
    placeholder.shift(item);
    console.log(placeholder)
    this.setState({finished: placeholder})
    this.handleDeleteItem(e);
    
  } 

  render() {
    return (
        //userInput
        //userList
        <div className="todoWrapper">
          {this.userId}
          <UserInput handleSubmit={this.handleSubmit} inputValue={this.state.inputValue} handleInputchange={this.handleInputchange}/>
          <List items={this.state.todoItems} finished={this.state.finished} handleCheckItem={this.handleCheckItem} handleDeleteItem={this.handleDeleteItem}/>
        </div>
      )
  }
}

function UserInput(props) {
  return (
    <div className="UserInput">
    <form className="noteWrapper"onSubmit={props.handleSubmit}>
      <input type="text" className="noteInput" value={props.inputValue} onChange={props.handleInputchange} name="userInput" placeholder="enter an entry" autocomplete="off"/>
    </form>
    </div>
    )
}

function List(props) {
  let items = props.items;
  let finished = props.finished;
  let span = <span> </span>
  return (
    <div>
      <ul>
      { items.map( (item, index) => <li key={index} index={index} item={item} onDoubleClick={props.handleCheckItem} > <span>  {item} </span> <button item={item} onDoubleClick={(e) => e.stopPropagation()} onClick={props.handleDeleteItem}> delete </button> </li>)}
      </ul>
      <ul>
      { finished.map( (item, index) => <li key={index + item} index={index} item={item} className="finished"> <span> {item} </span> <button  item={item} onClick={props.handleDeleteItem}> delete </button> </li>)}
      </ul>
    </div>
    )
}

export default Todo;