import { useState, useEffect } from "react";

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
        if (success) {
            updateList()
            setEntry("")
        } else {
            console.error("trouble tasking")
        }
    };

    
    const removeTask = async (id) => {
        const success = await fetch("https://playground.4geeks.com/todo/todos/"+id, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            
        })
        if (success) {
            updateList()
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-light text-gray-400 mb-6">ToDos</h1>
            <div className="bg-white shadow-md rounded-md w-96">
                <div className="flex gap-2 p-4 border-b">
                    <input 
                        type="text" 
                        onChange={(e) => setEntry(e.target.value)}
                        value={entry}
                        placeholder="Add a task"
                        className="w-full p-2 text-lg border border-gray-300 rounded-md"
                    />
                    <button 
                        onClick={addTask} 
                        className="bg-blue-500 text-white font bold px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Add Task
                    </button>
                </div>

                <ul className="divide-y divide-gray-200">
                    {tasks.map((task, index) => (
                        <li key={index} className="flex items-center justify-between p-4">
                            <span className="text-lg text-gray-700">{task.label}</span>                            
                            <span onClick={() => removeTask(task.id)} className="ml-auto cursor-pointer text-black hover:text-red-500 transition text-xl"
                            >
                                🗑️
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="p-4 text-gray-500 border-t text-sm"> {tasks.length == 0 ? 'No' : tasks.length} item{tasks.length !== 1 ? 's' : ''} left</div>
                <button 
                        onClick={clearAllTasks} 
                        className="bg-blue-500 text-white font bold px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Clear
                </button>
            </div>
        </div>
    );
};

export default Home;