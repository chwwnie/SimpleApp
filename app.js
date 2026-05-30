// Import required modules
const express = require('express');

// Create an Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// Declare any necessary variables or in-memory data structures here
let tasks = [];
let nextTaskId = 1;

// TASK: Define appropriate routes below
// ---------------------------------------------------

//Define a route to render the index page
app.get('/', (req, res) => {
    res.render('index', { tasks });
});

app.get('/tasks', (req, res) => {
    res.render('tasks');
});

app.post('/tasks', (req, res) => {
    const { taskName, taskCategory, description, taskdeadline } = req.body;
    const category = taskCategory || ' '; // Default category if none is provided
    const newTask = { id: nextTaskId++, taskName, taskCategory: category, description, taskdeadline };
    tasks.push(newTask);
    res.redirect('/view-tasks'); // Redirect to the tasks page after adding a new task
});


app.get('/tasks/:id/edit', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    res.render('editTask', { task });
});

app.post('/tasks/:id/edit', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { taskName, taskCategory, description, taskdeadline } = req.body;
    const category = taskCategory || ' '; // Default category if none is provided

    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], taskName, taskCategory: category, description, taskdeadline };
    } // Update the task with the new values
    res.redirect('/view-tasks'); // Redirect to the tasks page after editing a task
});

app.post('/tasks/:id/delete', (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== taskId);
    res.redirect('/view-tasks'); // Redirect to the tasks page after deleting a task
});

app.post('/tasks/:id/complete', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId); // Find the index of the task to mark as complete
    if (taskIndex !== -1) {
        tasks[taskIndex].isCompleted = true;
    }

    tasks = tasks.filter(t => t.id !== taskId); // Remove the task from the list
    tasks.push({ ...tasks[taskIndex], isCompleted: true }); // Add the completed task back to the list (you can choose to handle this differently if needed)
    res.redirect('/view-tasks'); // Redirect to the tasks page after marking complete
});

app.get('/view-tasks', (req, res) => {
    res.render('viewTask', { tasks: tasks });
});
// ---------------------------------------------------

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});