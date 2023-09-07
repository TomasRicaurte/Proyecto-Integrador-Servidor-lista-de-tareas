const http = require('http');
const port = 3000;
const host = "localhost"

let tasks = [
    {
        id: 1,
        description: "Tarea de prueba para tasks",
        completed: true,
    },
    {
        id: 2,
        description: "Tarea para probar la marcacion",
        completed: false
    }
]

function addTasks(description) { 
    const newTasks = {
    id: tasks.length + 1,
    description,
    completed: false
  }
  tasks.push(newTasks)
  return newTasks
};

function ChangeStatusTasks (id) {
    const tasks = tasks.find(task => task.id === id)
    if (task) {
        task.completed = !task.completed
        return task
    }
    return null
}

const server = http.createServer((req, res) => {
  if (req.url === '/tasks' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/JSON' });
    res.end(JSON.stringify(tasks));
  } else if (req.url === '/add-task' && req.method === 'POST') {
    let Content ='';
    req.on('data', (data) => {
        Content += data
    })
    req.on ('end', () => {
        const TasksData = JSON.parse(Content)
        const newTasks = addTasks(TasksData.description)
        res.writeHead(201, {'Content-Type': 'application/JSON'})
        res.end(JSON.stringify(newTasks))
    })
  } else if (req.url === '/status-task' && req.method === 'PUT') {
    const TaskId = parseInt(req.url.split('/status-task')[1])
    const updatedTask = ChangeStatusTasks(TaskId)
    if (updatedTask) {
        res.writeHead(200, {'Content-Type': 'application/JSON'})
        res.end(JSON.stringify(updatedTask))
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'})
        res.end('Tarea no encontrada')
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Ruta no encontrada');
  }
});

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
