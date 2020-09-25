import React, {Fragment, useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';
import ContextMenu from './ContextMenu.js'


class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userValue: "",
            items: {
                "item-1": { id: "item-1", priority: "toplist", content: "one" },
                "item-2": { id: "item-2", priority: "toplist", content: "two" },
                "item-3": { id: "item-3", priority: "toplist", content: "three" },
                "item-4": { id: "item-4", priority: "completed", content: "four" },
                "item-5": { id: "item-5", priority: "completed", content: "five" },
            },
            listPriorities: {},
            toplist: ["item-1", "item-2", "item-3"], 
            midlist: [], 
            completed: ["item-4", "item-5"]
        }
    }

    handleChange = (e) => {
        let userValue = e.target.value;
        this.setState({ userValue });
    }

    handleSubmit = (e) => {
        e.preventDefault(); //prevent page refresh
        let id = uuidv4(); // generate unique ID
    
        let userValue = this.state.userValue;
        if (!/\S/.test(userValue)) { // returns true if and only if there's a non-space character in string. Tab and newline count as spaces.
            this.setState({ userValue: "" });
        } else {
            this.setState({ userValue: "", items: { ...this.state.items, [id]: { id, priority: "midlist", content: userValue } },  midlist: [id, ...this.state.midlist, ]}, console.log(this.state)
            )  
        }

        
    }

    handleDelete = (e) => {
        //find name
        if (e.target.nodeName == "LI") { //delete with nothing on contextEdit, 
        
            let priority = e.target.getAttribute("priority"); //gets toppriority
            let thisState = this.state[priority];
            let itemID = e.target.getAttribute('item');
            let items = this.state.items;
            delete items[itemID];

            let index = thisState.indexOf(e.target.getAttribute("item"));
            
            thisState.splice(index, 1);
            //delete items[e.target.getAttribute("item")]
            this.setState({ items, [priority]: thisState})
        } else {
           
            let priority = e.target.parentElement.getAttribute("priority"); //gets toppriority
            let itemID = e.target.parentElement.getAttribute('item');
            let thisState = this.state[priority];
            let items = this.state.items;
            delete items[itemID];
            let index = thisState.indexOf(e.target.getAttribute("item"));
            
            thisState.splice(index, 1);
            //delete items[e.target.getAttribute("item")]
            this.setState({ items, [priority]: thisState})
    
        }
        //uncompleted

    }

    handleCheckItem = (e) => {
        

        e.stopPropagation();
        let items = this.state.items //store
        let item = e.target.getAttribute("item"); //get ID
        let completedArray = this.state.completed; 
        
        console.log(items[item].priority);
        if (items[item].priority === "completed") { //this is to reappened automatically to toplist
            console.log("true");
            items[item] = { id: item, priority: "toplist", content: this.state.items[item].content }
            let placeholder2 = this.state.toplist;
            placeholder2.push(item);
            let index = this.state.completed.indexOf(e.target.getAttribute("item"));
            completedArray.splice(index, 1);
            this.setState({ items, toplist: placeholder2, completed: completedArray }) //can clean this code up

        } else {

            let newCompleted = { id: item, priority: "completed", content: this.state.items[item].content }
            
            let currentPriority = this.state.items[item].priority;
            let updatedPriority = this.state[currentPriority]; //whatever the priority it might've been.
            let index = this.state[currentPriority].indexOf(item);
            updatedPriority.splice(index, 1); //removed
            completedArray.unshift(item); // adds new item
            items[item] = newCompleted //replaces it
            console.log(completedArray)
            this.setState({ items, completed: completedArray, [currentPriority]: updatedPriority }, console.log(this.state))
        
        }

        
        
    } 
    
    handleEdit = (e) => {
        let itemID = e.target.getAttribute('item');
        let elChildNode = e.target.childNodes;
        let sChildTextSum = "";

        elChildNode.forEach(function (value) {
            if (value.nodeType === Node.TEXT_NODE) {
                console.log("Current textNode value is : ", value.nodeValue.trim());
                sChildTextSum += value.nodeValue;
            }
        });

        let tmpContent = this.state.items[itemID]
        tmpContent.content = sChildTextSum;
        console.log(tmpContent)
        this.setState({ items: { ...this.state.items, [itemID]: tmpContent } })

        if (sChildTextSum == "") {
            this.handleDelete(e);
        }
    }

    keyPress = (event) =>  {
        if(event.charCode == 13) {
            event.preventDefault()
            window.getSelection().removeAllRanges(); //after pressing enter, exit selection
        }
    }
    
    componentDidMount() {
        let store = JSON.parse(localStorage.getItem("autosave"));
        console.log(store)
        this.setState(store);
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('autosave', JSON.stringify(nextState));
    }
    
     
    render() {
        return(
            <div className="Book">
                <UserInput userValue={this.state.userValue} handleSubmit={this.handleSubmit} handleChange={this.handleChange}/>
                <ListRender allstates={this.state} handleEdit={this.handleEdit} handleDelete={this.handleDelete} handleCheckItem={this.handleCheckItem} keyPress={this.keyPress} />
            </div>
        )

        
    }

}

function UserInput(props) {
    return (
        <form onSubmit={props.handleSubmit}>
            <input className="userInput" type="text" value={props.userValue} onChange={props.handleChange} placeholder="enter an item" />
        </form>
    )
}


function ListRender(props) {

    let {toplist, midlist, completed, items} = props.allstates

    

    return (
            <ul>
                {toplist.map(item => <li item={item} key={item} priority="toplist" className="high-priority" onDoubleClick={props.handleCheckItem} > <span item={item} suppressContentEditableWarning={true} onBlur={props.handleEdit} contentEditable="true" onKeyPress={props.keyPress}>{items[item].content}</span>
                <button item={item} onDoubleClick={(e) => e.stopPropagation()} onClick={props.handleDelete}  contentEditable="false"suppressContentEditableWarning={true}> delete </button> 
                </li>)}
                {midlist.map(item => <li item={item} key={item} priority="midlist" className="normal-priority" onDoubleClick={props.handleCheckItem} > <span item={item} suppressContentEditableWarning={true} onBlur={props.handleEdit} contentEditable="true" onKeyPress={props.keyPress}>{items[item].content}</span>
                <button item={item} onDoubleClick={(e) => e.stopPropagation()} onClick={props.handleDelete} contentEditable="false"suppressContentEditableWarning={true}> delete </button> 
                </li>)}
                {completed.map(item => <li item={item} key={item} priority="completed" className="completedz" onDoubleClick={props.handleCheckItem} > {items[item].content}
                <button item={item} onDoubleClick={(e) => e.stopPropagation()} onClick={props.handleDelete}> delete </button> 
                </li>)}
            </ul>
            
    )
}




export default Todo;

