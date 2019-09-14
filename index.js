const express = require("express");
const server = express();
const projects = [
  { id: "1", title: "Novo projeto 1", tasks: [] },
  { id: "2", title: "Novo projeto 2", tasks: [] },
  { id: "3", title: "Novo projeto 3", tasks: [] }
];

// Express needs to know that we are using JSON to manipulate data
server.use(express.json());

// Global middleware tath counts how many requests the user made
server.use((req, res, next) => {
  console.count("Request Count");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();
});
// Local middleware that throws an error if project does not exist with that id
function checkProjectInArray(req, res, next) {
  const project = projects.find(p => p.id === req.params.id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exist" });
  }
  return next();
}

// Show all projects registered
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Creates a new project
server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  var taskArray = [];
  projects.push({ id, title, taskArray });

  return res.json(projects);
});

// Creates a new task for selected project based on the id
server.post("/projects/:id/tasks", checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  var selectedProject = projects.find(p => p.id === id);
  selectedProject.tasks.push(title);

  return res.json(selectedProject);
});

// Edits a specified project, based on the id
server.put("/projects/:id", checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  var selectedProject = projects.find(p => p.id === id);
  selectedProject.title = title;

  return res.json(selectedProject);
});

// Deletes a specified project, based on the id
server.delete("/projects/:id", checkProjectInArray, (req, res) => {
  const { id } = req.params;
  var selectedProjectIndex = projects.findIndex(p => p.id === id);
  projects.splice(selectedProjectIndex, 1);

  return res.send();
});

server.listen(3000);
