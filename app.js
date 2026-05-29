// Import required modules
const express = require('express');

// Create an Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// Declare any necessary variables or in-memory data structures here
let nextTaskId = 1;
let tasks = [];

// TASK: Define appropriate routes below
// ---------------------------------------------------

//Define a route to render the index page
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/tasks', (req, res) => {
    res.render('tasks');
});

app.post('/tasks', (req, res) => {
    const { taskName, taskCategory, description } = req.body;

    const newTask = { id: nextTaskId++, taskName, taskCategory, description };
    tasks.push(newTask);
    res.redirect('/tasks'); // Redirect to the tasks page after adding a new task
});

app.get('/view-tasks', (req, res) => {
    res.render('viewTasks', { tasks });
});

app.get('/view-tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    res.render('task', { task });
});

app.post('/view-tasks/:id/edit', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { taskName, taskCategory, description } = req.body;
    const category = taskCategory || 'Uncategorized'; // Default category if none is provided

    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], taskName, taskCategory, description };
    }
    res.redirect('/tasks'); // Redirect to the tasks page after editing a task
});


app.get('/view-tasks/:id/delete', (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== taskId);
    res.redirect('/tasks'); // Redirect to the tasks page after deleting a task
});

app.get('/view-tasks', (req, res) => {
    res.render('viewTasks', { tasks });
});

app.get('/view-tasks', function(req, res) {
    const sortBy = req.query.sort || 'recent';
    let sortedTasks = [...tasks];

    if (sortBy === 'top') {
        sortedTasks.sort((a, b) => {
            const aDate = new Date(a.deadline);
            const bDate = new Date(b.deadline);

            return aDate - bDate; // Sort by deadline (soonest first)
        });
    }

    else if (sortBy === 'bottom' ) {
        sortedTasks.sort((a, b) => {
            const aDate = new Date(a.deadline);
            const bDate = new Date(b.deadline);

            return bDate - aDate; // Sort by deadline (furthest first)
        });
    }

    else if (sortBy === 'category') {
        categoryOrder = ['Exam', 'Project', 'Homework', 'Uncategorized']; 
        sortedTasks.sort((a, b) => {
            return categoryOrder.indexOf(a.taskCategory) - categoryOrder.indexOf(b.taskCategory);
        });
    }
});
// ---------------------------------------------------

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});