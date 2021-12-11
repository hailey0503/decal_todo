import React, { useEffect, useState } from "react";
import "./App.css";

// A todo app where the user can type in a todo and it will be added to the list
// of todos. The user can also edit and remove a todo from the list.
function App() {
	// TODOs: create two states here.
  // The state of the app is stored in the todos array.
	// The state of the input value should also be stored in a state.
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [itemInput, setItemInput] = useState('');

  useEffect(() => {
    load()
  }, [])


  function load() {
    fetch("http://localhost:3700/api/list")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result.tasks)
          setIsLoaded(true);
          setTasks(result.tasks);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }
  function setItem() {
    return fetch('http://localhost:3700/api/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task : itemInput })
    })
      .then(data => data.json())
      .then(()=>{load()})
   }

   function deleteItem(item) {
    return fetch('http://localhost:3700/api/delete', {
      method:'DELETE',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({task : item})
      })
    .then(()=>{load()})
   }


  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      
      <div className="TODOContainer">
        <div className="TODOInput">
          <input
            type="text"
            placeholder="Add a new todo"
            onChange={event => setItemInput(event.target.value)} value={itemInput}
          />
          <button onClick= {setItem}>
            Add
          </button>
        </div>
        <div className="TODOList">
          {/* TODO: consider mapping the todo array here into a list
                    of TODO items */}
          {tasks.map(item => (
            <div className="TODOItem" >        
                  <div className="TODOItemText">
                    <p>{item}</p> 
                  </div>
                  <div className="TODOItemDelete">
                    <button className="TODOItemButton" onClick = {()  => deleteItem(item)}>Remove</button>
                  </div>
            </div>
           ))}
          </div>
        </div>
    );
  } 
}

export default App;


