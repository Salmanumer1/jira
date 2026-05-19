// src/pages/Epics.jsx

import { useState } from "react";
import { useAppContext } from "../context/AppContext";

const STATUS_STYLES = {
  "In Progress": { background: "#dbeafe", color: "#1d4ed8" },
  "To Do":       { background: "#f3f4f6", color: "#6b7280" },
  "Done":        { background: "#dcfce7", color: "#166534" },
};

export default function Epics() {
  const {
    epicList,
    projectList,
    taskList,
    stories,
    addEpic,
    updateEpic,
    deleteEpic,
  } = useAppContext();

  const [showForm,    setShowForm]    = useState(false);
  const [form, setForm] = useState({
    name:      "",
    status:    "To Do",
    projectId: "",
  });

  // ── Epic Actions ──────────────────────────────────────────
  const handleAddEpic = () => {
    if (!form.name.trim()) return;
    addEpic({ ...form, projectId: Number(form.projectId) || null });
    setForm({ name: "", status: "To Do", projectId: "" });
    setShowForm(false);
  };

  const handleDeleteEpic = (id) => {
    deleteEpic(id);
  };

  const handleUpdateStatus = (id, status) => {
    updateEpic(id, { status });
  };

  // ── Helpers ───────────────────────────────────────────────
  const getProjectName = (projectId) =>
    projectList.find((p) => p.id === projectId)?.name || "No Project";

  const getProjectColor = (projectId) =>
    projectList.find((p) => p.id === projectId)?.color || "#6b7280";

  const getEpicTasks = (epicId) =>
    taskList.filter((t) => t.epicId === epicId);
 const getEpicstories = (epicId) =>
    stories.filter((t) => t.epicId === epicId);
  return (
    <div className="p-3">

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">Epics</h4>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Cancel" : "+ Add Epic"}
        </button>
      </div>

      {/* ── Add Epic Form ── */}
      {showForm && (
        <div className="border rounded p-3 mb-3 bg-light">
          <div className="row g-2">

            <div className="col-12">
              <input
                className="form-control form-control-sm"
                placeholder="Epic name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <select
                className="form-select form-select-sm"
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              >
                <option value="">Select Project (optional)</option>
                {projectList.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <select
                className="form-select form-select-sm"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>

            <div className="col-12">
              <button
                className="btn btn-success btn-sm w-100"
                onClick={handleAddEpic}
              >
                Add Epic
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Epic Cards ── */}
      <div className="row g-3">
        {epicList.length === 0 && (
          <div className="text-muted text-center py-4 col-12">
            No epics yet. Click "+ Add Epic" to create one.
          </div>
        )}

        {epicList.map((epic) => {
          const epicTasks    = getEpicTasks(epic.id);
          const doneTasks    = epicTasks.filter((t) => t.status === "Done").length;
          const projectColor = getProjectColor(epic.projectId);
          const Epicstories=getEpicstories(epic.id);

          return (
            <div key={epic.id} className="col-md-6 col-lg-4">
              <div className="border rounded p-3 bg-white h-100 d-flex flex-column gap-2">

                {/* ── Top: color bar by project ── */}
                <div
                  style={{
                    height: "4px",
                    borderRadius: "2px",
                    background: projectColor,
                    marginBottom: "4px",
                  }}
                />

                {/* ── Name + Delete ── */}
                <div className="d-flex justify-content-between align-items-start">
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>
                    {epic.name}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    style={{ fontSize: "11px", padding: "1px 7px" }}
                    onClick={() => handleDeleteEpic(epic.id)}
                  >
                    ✕
                  </button>
                </div>

                {/* ── Project Badge ── */}
                <span
                  style={{
                    fontSize: "11px",
                    background: projectColor + "22",
                    color: projectColor,
                    padding: "2px 8px",
                    borderRadius: "4px",
                    alignSelf: "flex-start",
                    fontWeight: 600,
                  }}
                >
                  {getProjectName(epic.projectId)}
                </span>

                {/* ── Status Dropdown ── */}
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    Status:
                  </span>
                  <select
                    className="form-select form-select-sm"
                    style={{ fontSize: "11px", width: "auto" }}
                    value={epic.status}
                    onChange={(e) => handleUpdateStatus(epic.id, e.target.value)}
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>

                {/* ── Task Progress Bar ── */}
                {epicTasks.length > 0 && (
                  <div>
                    <div
                      style={{
                        height: "4px",
                        background: "#e5e7eb",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(doneTasks / epicTasks.length) * 100}%`,
                          height: "100%",
                          background: "#5b8cf5",
                          borderRadius: "2px",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "10px", color: "#6b7280" }}>
                      {doneTasks}/{epicTasks.length} tasks done
                    </span>
                  </div>
                )}

                {/* ── Task List inside Epic ── */}
                {epicTasks.length > 0 && (
                  <div className="border rounded p-2 bg-light d-flex flex-column gap-1">
                    {epicTasks.map((task) => (
                      <div
                        key={task.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span style={{ fontSize: "12px" }}>{task.name}</span>
                        <span
                          style={{
                            ...STATUS_STYLES[task.status],
                            fontSize: "10px",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {epicTasks.length === 0 && (
                  <p className="text-muted m-0" style={{ fontSize: "12px" }}>
                    No tasks linked to this epic yet.
                  </p>
                )}
{(Epicstories||[]).length>0 && <div className="border rounded p-2 bg-light d-flex flex-column gap-1"  >
  {Epicstories.map((story)=>( <div
                        key={story.id} 
                        // className="d-flex justify-content-between align-items-center"
                      >
                       <h6 style={{ fontSize: "13px", color:"#800080"}}>Story:</h6>
                      <span style={{ fontSize: "12px", color:"red"}}>{story.title}: </span>
                      
                       <span style={{ fontSize: "10px" }}> {story. description}
                       </span>
                         
                      </div>))}
  </div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 