// src/context/AppContext.jsx

import { createContext, useContext, useState } from "react";
import {
  projects as initialProjects,
  epics    as initialEpics,
  tasks    as initialTasks,
} from "../data/mockData";

const AppContext = createContext();

export function AppProvider({ children }) {

  const [projectList, setProjectList] = useState(initialProjects);
  const [epicList,    setEpicList]    = useState(initialEpics);
  const [taskList,    setTaskList]    = useState(initialTasks);
  const [subtaskList, setSubtaskList] = useState([]);
  const [kanbanList,  setKanbanList]  = useState(initialTasks);
  const[stories,setstories]=useState([]); // kanban reads same tasks

  
  // PROJECTS
  

  const addProject = (project) => {
    setProjectList((prev) => [
      ...prev,
      {
        id:       prev.length + 1,
        progress: 0,
        status:   "In Progress",
        ...project,
      },
    ]);
  };

  const updateProject = (id, updated) => {
    setProjectList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const deleteProject = (id) => {
    // deleting project also removes its epics and their tasks
    setProjectList((prev) => prev.filter((p) => p.id !== id));
    const removedEpics = epicList.filter((e) => e.projectId === id).map((e) => e.id);
    setEpicList((prev) => prev.filter((e) => e.projectId !== id));
    setTaskList((prev) => prev.filter((t) => !removedEpics.includes(t.epicId)));
    setstories((prev)=>prev.filter((s)=>!removedEpics.includes(s.epicId)));
  };


  // EPICS
  

  const addEpic = (epic) => {
    setEpicList((prev) => [
      ...prev,
      {
        id:     prev.length + 1,
        status: "To Do",
        ...epic,
      },
    ]);
  };

  const updateEpic = (id, updated) => {
    setEpicList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
  };

  const deleteEpic = (id) => {
    // deleting epic also removes its tasks and their subtasks
    setEpicList((prev) => prev.filter((e) => e.id !== id));
    const removedTasks = taskList.filter((t) => t.epicId === id).map((t) => t.id);
    setTaskList((prev) => prev.filter((t) => t.epicId !== id));
    setSubtaskList((prev) => prev.filter((s) => !removedTasks.includes(s.taskId)));
    setstories((prev)=>prev.filter((s)=>s.epicId!==id));
  };


  // TASKS
  

  const addTask = (task) => {
    const newTask = {
      id:       taskList.length + 1,
      status:   "To Do",
      priority: "Med",
      ...task,
    };
    setTaskList((prev) => [...prev, newTask]);
    setKanbanList((prev) => [...prev, newTask]); // sync kanban
  };

  const updateTask = (id, updated) => {
    setTaskList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
    setKanbanList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTask = (id) => {
    setTaskList((prev) => prev.filter((t) => t.id !== id));
    setKanbanList((prev) => prev.filter((t) => t.id !== id));
    setSubtaskList((prev) => prev.filter((s) => s.taskId !== id));
  };

 
  // SUBTASKS


  const addSubtask = (subtask) => {
    setSubtaskList((prev) => [
      ...prev,
      {
        id:     prev.length + 1,
        status: "To Do",
        ...subtask,
      },
    ]);
  };

  const updateSubtask = (id, updated) => {
    setSubtaskList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const deleteSubtask = (id) => {
    setSubtaskList((prev) => prev.filter((s) => s.id !== id));
  };

 //stories:
 const addStory=(story)=>{
  setstories((prev)=>[
  ...prev,{
    id:prev.length+1,
    status:"To Do",
    priority:"Med",
    points:1,
    createdAt: new Date().toLocaleDateString(),
      ...story

  },
  ])

 };
 const deleteStory=(id)=>{
setstories((prev)=>prev.filter((s)=>s.id !== id));
 }
 const updateStory=(id,updated)=>{
  setstories((prev)=>prev.map((s)=>s.id==id?{...s,...updated}:s))
 }
  // KANBAN — moves task between columns

  const moveKanban = (taskId, newStatus) => {
    // update both kanban and task list so dashboard stays in sync
    updateTask(taskId, { status: newStatus });
  };

  // DERIVED STATS — dashboard reads these
 

  const stats = {
    totalProjects:   projectList.length,
    totalEpics:      epicList.length,
    totalTasks:      taskList.length,
    totalSubtasks:   subtaskList.length,
    completedTasks:  taskList.filter((t) => t.status === "Done").length,
    pendingTasks:    taskList.filter((t) => t.status === "To Do").length,
    inProgressTasks: taskList.filter((t) => t.status === "In Progress").length,
  };

  return (
    <AppContext.Provider
      value={{
        // lists
        projectList,
        epicList,
        taskList,
        subtaskList,
        kanbanList,
        stories,

        // stats
        stats,

        // project actions
        addProject,
        updateProject,
        deleteProject,

        // epic actions
        addEpic,
        updateEpic,
        deleteEpic,

        // task actions
        addTask,
        updateTask,
        deleteTask,

        // subtask actions
        addSubtask,
        updateSubtask,
        deleteSubtask,
//stories
addStory,
updateStory,
deleteStory,

        // kanban actions
        moveKanban,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}