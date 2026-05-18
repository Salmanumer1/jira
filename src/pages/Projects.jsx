// src/pages/Projects.jsx

import { useState } from "react";
import { useAppContext } from "../context/AppContext";

const STATUS_STYLES = {
  "In Progress": { background: "#dbeafe", color: "#1d4ed8" },
  "To Do":       { background: "#f3f4f6", color: "#6b7280" },
  "Done":        { background: "#dcfce7", color: "#166534" },
};

const COLOR_OPTIONS = [
  "#5b8cf5", "#3fc97a", "#e49b3a", "#e25454", "#9b59b6", "#1abc9c",
];

export default function Projects() {
  const {
    projectList,
    epicList,
    taskList,
    addProject,
    updateProject,
    deleteProject,
  } = useAppContext();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name:     "",
    tag:      "",
    status:   "In Progress",
    progress: 0,
    color:    "#5b8cf5",
  });

  // ── Project Actions ───────────────────────────────────────
  const handleAddProject = () => {
    if (!form.name.trim() || !form.tag.trim()) return;
    addProject({
      ...form,
      tag:      form.tag.toUpperCase(),
      progress: Number(form.progress),
    });
    setForm({ name: "", tag: "", status: "In Progress", progress: 0, color: "#5b8cf5" });
    setShowForm(false);
  };

  const handleDeleteProject = (id) => {
    deleteProject(id);
  };

  const handleUpdateStatus = (id, status) => {
    updateProject(id, { status });
  };

  const handleUpdateProgress = (id, progress) => {
    updateProject(id, { progress: Number(progress) });
  };

  // ── Helpers ───────────────────────────────────────────────
  const getProjectEpics = (projectId) =>
    epicList.filter((e) => e.projectId === projectId);

  const getProjectTasks = (projectId) => {
    const epicIds = epicList
      .filter((e) => e.projectId === projectId)
      .map((e) => e.id);
    return taskList.filter((t) => epicIds.includes(t.epicId));
  };

  return (
    <div className="p-3">

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">Projects</h4>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Cancel" : "+ Add Project"}
        </button>
      </div>

      {/* ── Add Project Form ── */}
      {showForm && (
        <div className="border rounded p-3 mb-3 bg-light">
          <div className="row g-2">

            <div className="col-md-6">
              <input
                className="form-control form-control-sm"
                placeholder="Project name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="col-md-3">
              <input
                className="form-control form-control-sm"
                placeholder="Tag e.g. CRM"
                maxLength={4}
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select form-select-sm"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>In Progress</option>
                <option>To Do</option>
                <option>Done</option>
              </select>
            </div>

            <div className="col-md-6">
              <label style={{ fontSize: "12px", color: "#6b7280" }}>
                Initial Progress: {form.progress}%
              </label>
              <input
                type="range"
                className="form-range"
                min="0"
                max="100"
                value={form.progress}
                onChange={(e) => setForm({ ...form, progress: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label style={{ fontSize: "12px", color: "#6b7280", display: "block" }}>
                Project Color
              </label>
              <div className="d-flex gap-2 mt-1">
                {COLOR_OPTIONS.map((color) => (
                  <div
                    key={color}
                    onClick={() => setForm({ ...form, color })}
                    style={{
                 
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: color,
                      cursor: "pointer",
                      border: form.color === color ? "3px solid #111" : "2px solid transparent",
                      transition: "border 0.15s ease",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="col-12">
              <button
                className="btn btn-success btn-sm w-100"
                onClick={handleAddProject}
              >
                Add Project
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Project Cards ── */}
      <div className="row g-3">
        {projectList.length === 0 && (
          <div className="text-muted text-center py-4 col-12">
            No projects yet. Click "+ Add Project" to create one.
          </div>
        )}

        {projectList.map((project) => {
          const projectEpics = getProjectEpics(project.id);
          const projectTasks = getProjectTasks(project.id);
          const doneTasks    = projectTasks.filter((t) => t.status === "Done").length;
          const doneEpics    = projectEpics.filter((e) => e.status === "Done").length;

          return (
            <div key={project.id} className="col-md-6 col-lg-4">
              <div className="border rounded p-3 bg-white h-100 d-flex flex-column gap-2">

                {/* ── Top color bar ── */}
                <div
                  style={{
                    height: "5px",
                    borderRadius: "2px",
                    background: project.color,
                    marginBottom: "4px",
                  }}
                />

                {/* ── Name + Tag + Delete ── */}
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "4px",
                        background: project.color + "22",
                        color: project.color,
                      }}
                    >
                      {project.tag}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                      {project.name}
                    </span>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    style={{ fontSize: "11px", padding: "1px 7px" }}
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    ✕
                  </button>
                </div>

                {/* ── Status Dropdown ── */}
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>Status:</span>
                  <select
                    className="form-select form-select-sm"
                    style={{ fontSize: "11px", width: "auto" }}
                    value={project.status}
                    onChange={(e) => handleUpdateStatus(project.id, e.target.value)}
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>

                {/* ── Progress Bar + Slider ── */}
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span style={{ fontSize: "11px", color: "#6b7280" }}>Progress</span>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: project.color }}>
                      {project.progress}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "6px",
                      background: "#e5e7eb",
                      borderRadius: "3px",
                      overflow: "hidden",
                      marginBottom: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: `${project.progress}%`,
                        height: "100%",
                        background: project.color,
                        borderRadius: "3px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="100"
                    value={project.progress}
                    onChange={(e) =>
                      handleUpdateProgress(project.id, e.target.value)
                    }
                  />
                </div>

                {/* ── Stats Row ── */}
                <div
                  className="d-flex gap-2"
                  style={{ borderTop: "1px solid #f3f4f6", paddingTop: "8px" }}
                >
                  <div
                    className="text-center flex-fill border rounded p-1"
                    style={{ fontSize: "11px" }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "16px" }}>
                      {projectEpics.length}
                    </div>
                    <div style={{ color: "#6b7280" }}>Epics</div>
                  </div>
                  <div
                    className="text-center flex-fill border rounded p-1"
                    style={{ fontSize: "11px" }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "16px" }}>
                      {projectTasks.length}
                    </div>
                    <div style={{ color: "#6b7280" }}>Tasks</div>
                  </div>
                  <div
                    className="text-center flex-fill border rounded p-1"
                    style={{ fontSize: "11px" }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#3fc97a",
                      }}
                    >
                      {doneTasks}
                    </div>
                    <div style={{ color: "#6b7280" }}>Done</div>
                  </div>
                </div>

                {/* ── Epics inside Project ── */}
                {projectEpics.length > 0 && (
                  <div className="border rounded p-2 bg-light d-flex flex-column gap-1">
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Epics ({doneEpics}/{projectEpics.length} done)
                    </span>
                    {projectEpics.map((epic) => (
                      <div
                        key={epic.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span style={{ fontSize: "12px" }}>{epic.name}</span>
                        <span
                          style={{
                            ...STATUS_STYLES[epic.status],
                            fontSize: "10px",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {epic.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {projectEpics.length === 0 && (
                  <p className="text-muted m-0" style={{ fontSize: "12px" }}>
                    No epics linked to this project yet.
                  </p>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}