// src/pages/stories.jsx

import { useState } from "react";
import { useAppContext } from "../context/AppContext";

const STATUS_STYLES = {
  "In Progress": { background: "#dbeafe", color: "#1d4ed8" },
  "To Do":       { background: "#f3f4f6", color: "#6b7280" },
  "Done":        { background: "#dcfce7", color: "#166534" },
};

const PRIORITY_STYLES = {
  High: { background: "#fee2e2", color: "#b91c1c" },
  Med:  { background: "#fef3c7", color: "#92400e" },
  Low:  { background: "#dcfce7", color: "#166534" },
};

const POINT_OPTIONS = [1, 2, 3, 5, 8, 13];

export default function stories() {
  const {
    stories,
    addStory,
    updateStory,
    deleteStory,
    epicList,
    projectList,
    taskList,
  } = useAppContext();

  const [showForm,      setShowForm]      = useState(false);
  const [expandedStory, setExpandedStory] = useState(null);
  const [form, setForm] = useState({
    title:       "",
    description: "",
    priority:    "Med",
    status:      "To Do",
    epicId:      "",
    points:      1,
  });
 

  // ── Story Actions ─────────────────────────────────────────
  const handleAddStory = () => {
    if (!form.title.trim()) return;
    addStory({ ...form, epicId: Number(form.epicId) || null, points: Number(form.points) });
    setForm({ title: "", description: "", priority: "Med", status: "To Do", epicId: "", points: 1 });
    setShowForm(false);
  };

  const handleDeleteStory  = (id)         => deleteStory(id);
  const handleUpdateStatus = (id, status) => updateStory(id, { status });

  // ── Helpers ───────────────────────────────────────────────
  const getEpicName = (epicId) =>
    epicList.find((e) => e.id === epicId)?.name || "No Epic";

  const getProjectByEpic = (epicId) => {
    const epic = epicList.find((e) => e.id === epicId);
    return projectList.find((p) => p.id === epic?.projectId);
  };

  const getLinkedTasks = (epicId) =>
    taskList.filter((t) => t.epicId === epicId);

  // ── Stats ─────────────────────────────────────────────────
const totalPoints = (stories || []).reduce(
  (sum, s) => sum + (s.points || 0),
  0
);

const completedPoints = (stories || [])
  .filter((s) => s.status === "Done")
  .reduce((sum, s) => sum + (s.points || 0), 0);

const donestories = (stories || []).filter(
  (s) => s.status === "Done"
).length;

const inProgstories = (stories || []).filter(
  (s) => s.status === "In Progress"
).length;

  return (
    <div className="p-3">

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">Stories</h4>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Cancel" : "+ Add Story"}
        </button>
      </div>

      {/* ── Stats Row ── */}
      {(stories || []).length> 0 && (
        <div className="d-flex gap-3 mb-3">
          {[
            { label: "Total",        value: (stories||[]).length, color: "#6b7280" },
            { label: "In Progress",  value: inProgstories,    color: "#1d4ed8" },
            { label: "Done",         value: donestories,      color: "#166534" },
            { label: "Total Points", value: totalPoints,      color: "#92400e" },
            { label: "Done Points",  value: completedPoints,  color: "#166534" },
          ].map((stat) => (
            <div key={stat.label} className="flex-fill text-center border rounded p-2">
              <div style={{ fontSize: "18px", fontWeight: 600, color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Story Form ── */}
      {showForm && (
        <div className="border rounded p-3 mb-3 bg-light">
          <div className="row g-2">

            <div className="col-12">
              <input
                className="form-control form-control-sm"
                placeholder="Story title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="col-12">
              <textarea
                className="form-control form-control-sm"
                placeholder="As a user, I want to... so that..."
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select form-select-sm"
                value={form.epicId}
                onChange={(e) => setForm({ ...form, epicId: e.target.value })}
              >
                <option value="">Select Epic (optional)</option>
                {epicList.map((epic) => (
                  <option key={epic.id} value={epic.id}>{epic.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select form-select-sm"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option>High</option>
                <option>Med</option>
                <option>Low</option>
              </select>
            </div>

            <div className="col-md-3">
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

            <div className="col-md-3">
              <select
                className="form-select form-select-sm"
                value={form.points}
                onChange={(e) => setForm({ ...form, points: e.target.value })}
              >
                {POINT_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p} {p === 1 ? "point" : "points"}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <button className="btn btn-success btn-sm w-100" onClick={handleAddStory}>
                Add Story
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Story Cards ── */}
      <div className="row g-3">
        {(stories || []).length === 0 && (
          <div className="text-muted text-center py-4 col-12">
            No stories yet. Click "+ Add Story" to create one.
          </div>
        )}

        {(stories || []).map((story) => {
          const isExpanded  = expandedStory === story.id;
          const project     = getProjectByEpic(story.epicId);
          const linkedTasks = getLinkedTasks(story.epicId);
          const doneTasks   = linkedTasks.filter((t) => t.status === "Done").length;

          return (
            <div key={story.id} className="col-md-6 col-lg-4">
              <div className="border rounded p-3 bg-white h-100 d-flex flex-column gap-2">

                {/* Project color bar */}
                <div style={{ height: "4px", borderRadius: "2px", background: project?.color || "#e5e7eb" }} />

                {/* Title + Delete */}
                <div className="d-flex justify-content-between align-items-start">
                  <span style={{ fontSize: "14px", fontWeight: 600, flex: 1 }}>{story.title}</span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    style={{ fontSize: "11px", padding: "1px 7px" }}
                    onClick={() => handleDeleteStory(story.id)}
                  >
                    ✕
                  </button>
                </div>

                {/* Description */}
                {story.description && (
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, fontStyle: "italic" }}>
                    {story.description}
                  </p>
                )}

                {/* Epic + Project badges */}
                <div className="d-flex gap-1 flex-wrap">
                  <span style={{ fontSize: "10px", background: "#f3f4f6", color: "#6b7280", padding: "2px 8px", borderRadius: "4px" }}>
                    {getEpicName(story.epicId)}
                  </span>
                  {project && (
                    <span style={{ fontSize: "10px", background: project.color + "22", color: project.color, padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>
                      {project.name}
                    </span>
                  )}
                </div>

                {/* Priority + Points + Status */}
                <div className="d-flex gap-2 align-items-center flex-wrap">
                  <span style={{ ...PRIORITY_STYLES[story.priority], fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px" }}>
                    {story.priority}
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: 600, background: "#f3e8ff", color: "#7c3aed", padding: "2px 8px", borderRadius: "4px" }}>
                    {story.points} {story.points === 1 ? "pt" : "pts"}
                  </span>
                  <select
                    className="form-select form-select-sm ms-auto"
                    style={{ fontSize: "11px", width: "auto" }}
                    value={story.status}
                    onChange={(e) => handleUpdateStatus(story.id, e.target.value)}
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>

                {/* Task progress bar */}
                {linkedTasks.length > 0 && (
                  <div>
                    <div style={{ height: "4px", background: "#e5e7eb", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: `${(doneTasks / linkedTasks.length) * 100}%`, height: "100%", background: project?.color || "#5b8cf5", borderRadius: "2px", transition: "width 0.3s ease" }} />
                    </div>
                    <span style={{ fontSize: "10px", color: "#6b7280" }}>
                      {doneTasks}/{linkedTasks.length} tasks done
                    </span>
                  </div>
                )}

                {/* Created date */}
                <span style={{ fontSize: "10px", color: "#9ca3af" }}>
                  Created {story.createdAt}
                </span>

                {/* Toggle Tasks */}
                {linkedTasks.length > 0 && (
                  <button
                    className="btn btn-sm btn-outline-secondary w-100"
                    style={{ fontSize: "11px" }}
                    onClick={() => setExpandedStory(isExpanded ? null : story.id)}
                  >
                    {isExpanded ? "▲ Hide Tasks" : `▼ View Tasks (${linkedTasks.length})`}
                  </button>
                )}

                {/* Linked Tasks Panel */}
                {isExpanded && (
                  <div className="border rounded p-2 bg-light d-flex flex-column gap-1">
                    {linkedTasks.map((task) => (
                      <div key={task.id} className="d-flex justify-content-between align-items-center py-1">
                        <span style={{ fontSize: "12px" }}>{task.name}</span>
                        <span style={{ ...STATUS_STYLES[task.status], fontSize: "10px", padding: "2px 6px", borderRadius: "4px" }}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}