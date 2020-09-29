import React, {Fragment, useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userValue: "", 
            items: {
                "item-1": { id: "item-1", priority: "toplist", content: "introduce drag and drop into the application" },
                "item-2": { id: "item-2", priority: "toplist", content: "two" },
                "item-3": { id: "item-3", priority: "toplist", content: "three" },
                "item-4": { id: "item-4", priority: "completed", content: "four" },
                "item-5": { id: "item-5", priority: "completed", content: "five" },
            },
            columns: {
                toplist: {
                    id: 'toplist',
                    title: 'toplist',
                    taskIds: ["item-1", "item-2", "item-3"]
                },
                midlist: {
                    id: 'midlist',
                    title: 'midlist',
                    taskIds: [],
                },
                completed: {
                    id: 'completed',
                    title: 'completed',
                    taskIds: ["item-4", "item-5"],
                }
            },
            columnOrder: ['toplist', 'midlist'],
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
            this.setState({
                userValue: "",
                items: { ...this.state.items, [id]: { id, priority: "midlist", content: userValue } },
                columns: { ...this.state.columns, midlist: { ...this.state.columns.midlist, taskIds: [id, ...this.state.columns.midlist.taskIds] } }
            }
            )  
        }

        
    }

    handleDelete = (e) => {
        //find name
        if (e.target.nodeName == "LI") { //delete with nothing on contextEdit, 
        
            let priority = e.target.getAttribute("priority"); //gets toppriority
            let thisState = this.state.columns[priority].taskIds; //Column Target
            let itemID = e.target.getAttribute('item');
            let items = this.state.items;
            delete items[itemID];

            let index = thisState.indexOf(e.target.getAttribute("item"));
            
            thisState.splice(index, 1);
            //delete items[e.target.getAttribute("item")]
            this.setState({ items, columns: { ...this.state.columns, [priority]: {...this.state.columns[priority], taskIds: thisState},  } })
        } else {
           
            let priority = e.target.parentElement.getAttribute("priority"); //gets toppriority
            let itemID = e.target.parentElement.getAttribute('item');
            let thisState = this.state.columns[priority].taskIds; 
            let items = this.state.items;
            delete items[itemID];
            let index = thisState.indexOf(e.target.getAttribute("item")); //can be simplified
            
            thisState.splice(index, 1);
            //delete items[e.target.getAttribute("item")]
            this.setState({ items, columns: { ...this.state.columns, [priority]: {...this.state.columns[priority], taskIds: thisState},  } })
    
        }
        //uncompleted
        
    }


    handleCheckItem = (e) => {
        
        e.stopPropagation();
        let items = this.state.items //store
        let item = e.target.getAttribute("item"); //get ID
        let completedArray = this.state.columns.completed.taskIds; 
        
        if (items[item].priority === "completed") { //this is to reappened automatically to toplist
            console.log("true");
            items[item] = { id: item, priority: "toplist", content: this.state.items[item].content }
            let placeholder2 = this.state.columns.toplist.taskIds;
            placeholder2.push(item);
            let index = this.state.columns.completed.taskIds.indexOf(e.target.getAttribute("item"));
            completedArray.splice(index, 1);
            this.setState({ items, columns: { ...this.state.columns, toplist: {...this.state.columns.toplist, taskIds: placeholder2}, completed: {...this.state.columns.completed, taskIds: completedArray} } }) //can clean this code up

        } else {

            let newCompleted = { id: item, priority: "completed", content: this.state.items[item].content }
            
            let currentPriority = this.state.items[item].priority;
            let targetPriorityList = this.state.columns[currentPriority].taskIds; //whatever the priority it might've been.
            let index = this.state.columns[currentPriority].taskIds.indexOf(item);
            targetPriorityList.splice(index, 1); //removed
            completedArray.unshift(item); // adds new item
            items[item] = newCompleted //replaces it
            console.log(completedArray)
            this.setState({ items, columns: {...this.state.columns, completed: {...this.state.columns.completed, taskIds: completedArray}, [currentPriority]: {...this.state.columns[currentPriority], targetPriorityList}} }, console.log(this.state))
        
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

    onDragEnd = result => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return
        }

        if (
            destination.droppableId === source.droppableId && 
            destination.index === source.index
        ) {
            return;
        }

        const start = this.state.columns[source.droppableId];
        const finish = this.state.columns[destination.droppableId];
    
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);
    
            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            }
    
            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newColumn.id]: newColumn,
                },
            }
    
            this.setState(newState);
            return;
        }

        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        }

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        }

        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish
            }
        }


    }
 
    render() {
        let taskFunctions = [this.handleEdit, this.handleDelete, this.handleCheckItem, this.keyPress]
        return(
            <div className="Book">
                <UserInput userValue={this.state.userValue} handleSubmit={this.handleSubmit} handleChange={this.handleChange}/>
                <PrioritizedLists onDragEnd={this.onDragEnd} taskFunctions={taskFunctions} data={this.state} handleEdit={this.handleEdit} handleDelete={this.handleDelete} handleCheckItem={this.handleCheckItem} keyPress={this.keyPress} />
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

    let items = props.allstates.items;
    let { toplist, midlist, completed } = props.allstates.columns;
    toplist = toplist.taskIds;
    midlist = midlist.taskIds;
    completed = completed.taskIds;


    //assume you got only the states, now you can maniplate the list order features here.

    // call function to change the priority of the higher state.

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


//
function PrioritizedLists(props) {


    return (
        <ul>
            <DragDropContext
                onDragEnd={props.onDragEnd}
            >
            {
                props.data.columnOrder.map(columnRank => {
                    const column = props.data.columns[columnRank]
                    const items = column.taskIds.map(id => props.data.items[id])


                    return <Column taskFunctions={props.taskFunctions} key={column.id} column={column} items={props.data.items} />
                })
                }
                </DragDropContext>
            <Completed completed={props.data.columns.completed.taskIds} items={props.data.items} taskFunctions={props.taskFunctions}/>
    
        </ul>

    )
}

function Column(props) {   
    return (
        <Droppable droppableId={props.column.id} type={props.column.id === "toplist" ? 'done' : 'active'}>
            
                {(provided) => (
                    <div ref= { provided.innerRef } // Attention to this, need a extra div here
                {...provided.droppableProps}
                >
                    {props.column.taskIds.map((item, index) => <Task item={item} index={index} taskFunctions={props.taskFunctions} items={props.items}/>)}
                {provided.placeholder}
                    </div>       
                )
                }   
        </Droppable>  
    )

}

function Completed(props) {
    let [handleEdit, handleDelete, handleCheckItem, keyPress] = props.taskFunctions;

    return (
        props.completed.map(item => <li item={item} key={item} priority={props.items[item].priority} className={props.items[item].priority} onDoubleClick={handleCheckItem} > <span item={item} suppressContentEditableWarning={true} onBlur={handleEdit} contentEditable="false" onKeyPress={keyPress}>{props.items[item].content}</span>
        <button item={item} onDoubleClick={(e) => e.stopPropagation()} onClick={handleDelete}> delete </button> </li>)
    )
}

function Task(props) {
    let [handleEdit, handleDelete, handleCheckItem, keyPress] = props.taskFunctions;
    let item = props.item;

    

    return (
     
        <Draggable draggableId={item} index={props.index} key={item} > 
            {(provided, snapshot) => (
     
                <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} isDragging={snapshot.isDragging} item={item} key={item} priority={props.items[item].priority} className={props.items[item].priority} onMoueDown={handleCheckItem} onDoubleClick={handleCheckItem} >  <span  item={item} suppressContentEditableWarning={true} unselectable="on" onBlur={handleEdit} contentEditable={false} onKeyPress={keyPress}>{props.items[item].content}</span>
                    <button item={item} onDoubleClick={(e) => e.stopPropagation()} onClick={handleDelete} contentEditable="false" suppressContentEditableWarning={true}> delete </button> 

                    </li>
      
            )

            }
            </Draggable>

    )
}




export default Todo;

