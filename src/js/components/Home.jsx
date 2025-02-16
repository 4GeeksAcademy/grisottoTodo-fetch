import { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";



const Home = () => {
    const [entry, setEntry] = useState("");
    const [tasks, setTasks] = useState([]);
    
    const updateList = () => {
        fetch("https://playground.4geeks.com/todo/users/claudio")
        .then(response => response.json())
        .then(data => setTasks(data.todos))
        .catch(error => console.error("Error fetching tasks:", error));
    }

    useEffect(() => {        
        updateList()         
    }, []);


    const addTask = async () => {
        if (entry.trim() === "") {
            alert("task cannot be empty")
            return
        }
        const success = await fetch("https://playground.4geeks.com/todo/todos/claudio",{
            method: "POST",
            body: JSON.stringify({label: entry, is_done: false}),
            headers: {
            "Content-Type": "application/json"
            
            }
        }) 
        if (success.ok) {
            updateList()
            setEntry("")
            console.log("Task added successfully")
        } else {
            console.error("Error adding a task", error)
        }
    };

    
    const removeTask = async (id) => {
        const success = await fetch("https://playground.4geeks.com/todo/todos/"+id, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            
        })
        if (success.ok) {
            updateList()
            console.log("Task removed successfully")
        } else {
            console.error("trouble deleting")
        }
       
        
    };
    const clearAllTasks = () => {
        fetch("https://playground.4geeks.com/todo/users/claudio", { method: "DELETE" })
            .then(response => {
                if (response.ok) {
                    setTasks([]);
                }
            })
            .catch(error => console.error("Error deleting tasks:", error));
    };
    
    


return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card shadow-lg p-3 bg-white rounded w-100" style={{ maxWidth: "400px" }}>
            <h1 className="text-center text-secondary mb-4">ToDos</h1>

            
            <div className="input-group mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Add a task" 
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                />
                <button className="btn btn-primary" onClick={addTask}>
                    Add
                </button>
            </div>

            
            <ul className="list-group">
                {tasks.map((task) => (
                    <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{task.label}</span>
                        <button className="btn btn-sm text-dark" onClick={() => removeTask(task.id)}>
                        <i class="fa-solid fa-trash fa-lg"></i>
                        </button>
                    </li>
                ))}
            </ul>

            
            <div className="text-center mt-3 text-muted">
                {tasks.length === 0 ? "No items left" : `${tasks.length} item(s) left`}
            </div>

            
            <button className="btn btn-danger w-100 mt-3" onClick={clearAllTasks}>
                Clear All
            </button>
        </div>
    </div>
);
};

export default Home;