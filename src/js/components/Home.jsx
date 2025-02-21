import { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const USERNAME = "clauTech";

const Home = () => {
    const [entry, setEntry] = useState("");
    const [tasks, setTasks] = useState([]);

    
    const initializeUser = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${USERNAME}`);
            if (response.ok) {
                console.log("User already exists.");
                updateList(); 
            } else {
                console.log("User does not exist. Creating user...");
                const createUser = await fetch(`https://playground.4geeks.com/todo/users/${USERNAME}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify([]),
                });

                if (createUser.ok) {
                    console.log("User created successfully.");
                    updateList();
                } else {
                    throw new Error("Failed to create user.");
                }
            }
        } catch (error) {
            console.error("Error initializing user:", error);
        }
    };

    
    const updateList = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${USERNAME}`);
            if (!response.ok) throw new Error("Failed to fetch tasks");
            const data = await response.json();
            setTasks(data.todos);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    
    useEffect(() => {
        initializeUser();
    }, []);

    
    const addTask = async () => {
        if (entry.trim() === "") {
            alert("Task cannot be empty!");
            return;
        }

        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${USERNAME}`, {
                method: "POST",
                body: JSON.stringify({ label: entry, is_done: false }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to add task");

            setEntry(""); 
            updateList();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

   
    const removeTask = async (id) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to delete task");

            updateList();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    
    const clearAllTasks = async () => {
        
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${USERNAME}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to clear tasks");

            initializeUser();
        } catch (error) {
            console.error("Error clearing tasks:", error);
        }
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
                                <i className="fas fa-trash fa-lg"></i>
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
