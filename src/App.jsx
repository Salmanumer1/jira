import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/TopBar";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Epics from "./pages/Epics";
import Stories from "./pages/Stories";
import Tasks from "./pages/Tasks";
import Subtasks from "./pages/Subtasks";
import Kanban from "./pages/Kanban";
import"./App.css"

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{ flex: 1 }}>
          <Topbar name="Collabuz"/>

          <div style={{ padding: "20px" }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/epics" element={<Epics />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/tasks" element={<Tasks />} />
              
              <Route path="/kanban" element={<Kanban />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}