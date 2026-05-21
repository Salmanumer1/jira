// src/data/mockData.js  ← treat this as your "database"

export const projects = [
  {
    id: 1,
    name: "CRM Platform",
    tag: "CRM",
    status: "In Progress",
    progress: 72,
    color: "#5b8cf5",
  },
  {
    id: 2,
    name: "Mobile App v2",
    tag: "MOB",
    status: "In Progress",
    progress: 38,
    color: "#e49b3a",
  },
  {
    id: 3,
    name: "Admin Panel",
    tag: "ADM",
    status: "Done",
    progress: 100,
    color: "#3fc97a",
  },
];

export const epics = [
  { id: 1, projectId: 1, name: "User Authentication",  status: "Done"        },
  { id: 2, projectId: 1, name: "Dashboard Module",     status: "In Progress" },
  { id: 3, projectId: 2, name: "Onboarding Flow",      status: "To Do"       },
  { id: 4, projectId: 2, name: "Push Notifications",   status: "In Progress" },
  { id: 5, projectId: 3, name: "Role Management",      status: "Done"        },
];

export const tasks = [
  { id: 1, epicId: 1, name: "Implement auth flow",  priority: "High", status: "In Progress" },
  { id: 2, epicId: 1, name: "Write API docs",        priority: "Med",  status: "To Do"       },
  { id: 3, epicId: 2, name: "Update readme",         priority: "Low",  status: "Done"        },
  { id: 4, epicId: 3, name: "Design onboarding UI",  priority: "High", status: "To Do"       },
  { id: 5, epicId: 4, name: "Setup push service",    priority: "Med",  status: "In Progress" },
];


export const sprintData = [
  {
    sprint: "Sprint 1",
    completed: 18,
    pending: 50,
  },
  {
    sprint: "Sprint 2",
    completed: 24,
    pending: 40,
  },
  {
    sprint: "Sprint 3",
    completed: 30,
    pending: 35,
  },
  {
    sprint: "Sprint 4",
    completed: 36,
    pending: 20,
  },
  {
    sprint: "Sprint 5",
    completed: 42,
    pending: 5,
  },
];