// src/pages/Dashboard.jsx

import { useAppContext } from "../context/AppContext";  // ← add this
import { sprintData } from "../data/mockData";          // ← keep only sprintData from mockData
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid, Line, LineChart,
} from "recharts";
import "./Dashboard.css";

const PRIORITY_STYLES = {
  High: { background: "#fee2e2", color: "#b91c1c" },
  Med:  { background: "#fef3c7", color: "#92400e" },
  Low:  { background: "#dcfce7", color: "#166534" },
};

const STATUS_STYLES = {
  "In Progress": { background: "#dbeafe", color: "#1d4ed8" },
  "To Do":       { background: "#f3f4f6", color: "#6b7280" },
  "Done":        { background: "#dcfce7", color: "#166534" },
};

function TaskRow({ task, isLast }) {
  return (
    <div className={`d-flex justify-content-between align-items-center p-2 ${isLast ? "" : "border-bottom"}`}>
      <div className="d-flex align-items-center gap-2">
        <span className="priority-badge" style={PRIORITY_STYLES[task.priority]}>
          {task.priority}
        </span>
        <span style={{ fontSize: "16px" }}>{task.name}</span>
      </div>
      <span className="status-chip" style={STATUS_STYLES[task.status]}>
        {task.status}
      </span>
    </div>
  );
}

function EpicRow({ epic, isLast }) {
  return (
    <div className={`d-flex justify-content-between align-items-center p-2 ${isLast ? "" : "border-bottom"}`}>
      <span style={{ fontSize: "16px" }}>{epic.name}</span>
      <span className={`status-chip ${epic.status === "Done" ? "done" : epic.status === "In Progress" ? "in-progress" : "todo"}`}>
        {epic.status}
      </span>
    </div>
  );
}

export default function Dashboard() {

  // ── replace mockData imports with context ──────────────────
  const { projectList, epicList, taskList, stats } = useAppContext();

  const navigate = useNavigate();

  // ── chartData now from context projectList ─────────────────
  const chartData = projectList.map((p) => ({
    name:      p.tag,
    Progress:  p.progress,
    Remaining: 100 - p.progress,
  }));

  const linedata = sprintData.map((s) => ({
    sprint:    s.sprint,
    completed: s.completed,
    pending:   s.pending,
  }));

  return (
    <div className="dashboard">

      {/* ── Row 1: Stat Cards ── */}
      <div className="stat-cards">
        <Card title="Project"     value={stats.totalProjects}   />
        <Card title="Task"        value={stats.totalTasks}       />
        <Card title="Completed"   value={stats.completedTasks}  />
        <Card title="In Progress" value={stats.inProgressTasks} />
        <Card title="Pending"     value={stats.pendingTasks}    />

        <div style={{ width: "100%", height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={linedata} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="sprint" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="completed" stroke="#5b8cf5" strokeWidth={2} dot={{ r: 4, fill: "#5b8cf5" }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="pending"   stroke="#b7b256" strokeWidth={2} dot={{ r: 4, fill: "#e5e7eb" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task and Epic */}
      <div className="bottom-section">

        <div className="left-panel">

          {/* Tasks */}
          <div className="left-panel-block">
            <div className="left-panel-block-header">
              <h5>My Tasks</h5>
              <Button onClick={() => navigate("/Tasks")}>New Task</Button>
            </div>
            <div className="left-panel-block-body">
              {taskList.map((task, index) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  isLast={index === taskList.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Epics */}
          <div className="left-panel-block">
            <div className="left-panel-block-header">
              <h5>Epics</h5>
              <Button onClick={() => navigate("/Epics")}>New Epic</Button>
            </div>
            <div className="left-panel-block-body">
              {epicList.map((epic, index) => (
                <EpicRow
                  key={epic.id}
                  epic={epic}
                  isLast={index === epicList.length - 1}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Right Panel — Chart */}
        <div className="right-panel">
          <div className="right-panel-header">
            <h5>Project Progress</h5>
          </div>
          <div className="right-panel-body">

            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} unit="%" />
                  <Tooltip formatter={(value) => `${value}%`} contentStyle={{ fontSize: "12px", borderRadius: "6px" }} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="Progress"  fill="#5b8cf5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Remaining" fill="#b37757" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="border-top pt-2">
              {projectList.map((project) => (
                <div key={project.id} className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge" style={{ background: project.color + "22", color: project.color, fontSize: "10px" }}>
                    {project.tag}
                  </span>
                  <span style={{ fontSize: "12px", flex: 1 }}>{project.name}</span>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${project.progress}%`, background: project.color }} />
                  </div>
                  <span style={{ fontSize: "11px", color: "#6b7280", minWidth: "32px", textAlign: "right" }}>
                    {project.progress}%
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}