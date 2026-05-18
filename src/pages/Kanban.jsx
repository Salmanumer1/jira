// src/pages/Kanban.jsx

import { useState } from "react";
import { useAppContext } from "../context/AppContext";

const COLUMNS = ["To Do", "In Progress", "Done"];

const COLUMN_STYLES = {
  "To Do":       { header: "#f3f4f6", color: "#6b7280",  border: "#e5e7eb" },
  "In Progress": { header: "#dbeafe", color: "#1d4ed8",  border: "#bfdbfe" },
  "Done":        { header: "#dcfce7", color: "#166534",  border: "#bbf7d0" },
};

const PRIORITY_STYLES = {
  High: { background: "#fee2e2", color: "#b91c1c" },
  Med:  { background: "#fef3c7", color: "#92400e" },
  Low:  { background: "#dcfce7", color: "#166534" },
};

export default function Kanban() {
  const {
    taskList,
    epicList,
    projectList,
    moveKanban,
    addTask,
    deleteTask,
  } = useAppContext();

  const [draggedTask,   setDraggedTask]   = useState(null);
  const [dragOverCol,   setDragOverCol]   = useState(null);
  const [showForm,      setShowForm]      = useState(false);
  const [form, setForm] = useState({
    name:      "",
    priority:  "Med",
    status:    "To Do",
    epicId:    "",
  });

  // ── Drag Handlers ─────────────────────────────────────────
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, column) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(column);
  };

  const handleDrop = (e, column) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== column) {
      moveKanban(draggedTask.id, column);  // updates context + dashboard
    }
    setDraggedTask(null);
    setDragOverCol(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverCol(null);
  };

  // ── Add Task ──────────────────────────────────────────────
  const handleAddTask = () => {
    if (!form.name.trim()) return;
    addTask({ ...form, epicId: Number(form.epicId) || null });
    setForm({ name: "", priority: "Med", status: "To Do", epicId: "" });
    setShowForm(false);
  };

  // ── Helpers ───────────────────────────────────────────────
  const getColumnTasks = (column) =>
    taskList.filter((t) => t.status === column);

  const getEpicName = (epicId) =>
    epicList.find((e) => e.id === epicId)?.name || null;

  const getProjectColor = (epicId) => {
    const epic    = epicList.find((e) => e.id === epicId);
    const project = projectList.find((p) => p.id === epic?.projectId);
    return project?.color || "#e5e7eb";
  };

  return (
    <div className="p-3">

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">Kanban Board</h4>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Cancel" : "+ Add Task"}
        </button>
      </div>

      {/* ── Add Task Form ── */}
      {showForm && (
        <div className="border rounded p-3 mb-3 bg-light">
          <div className="row g-2">

            <div className="col-12">
              <input
                className="form-control form-control-sm"
                placeholder="Task name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select form-select-sm"
                value={form.epicId}
                onChange={(e) => setForm({ ...form, epicId: e.target.value })}
              >
                <option value="">Select Epic (optional)</option>
                {epicList.map((epic) => (
                  <option key={epic.id} value={epic.id}>
                    {epic.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
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

            <div className="col-md-4">
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
                onClick={handleAddTask}
              >
                Add Task
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Kanban Columns ── */}
      <div className="d-flex gap-3" style={{ alignItems: "flex-start" }}>
        {COLUMNS.map((column) => {
          const colTasks  = getColumnTasks(column);
          const colStyle  = COLUMN_STYLES[column];
          const isDragOver = dragOverCol === column;

          return (
            <div
              key={column}
              onDragOver={(e) => handleDragOver(e, column)}
              onDrop={(e) => handleDrop(e, column)}
              style={{
                flex: 1,
                minWidth: 0,
                border: `2px solid ${isDragOver ? colStyle.color : colStyle.border}`,
                borderRadius: "10px",
                overflow: "hidden",
                transition: "border 0.15s ease",
                background: isDragOver ? colStyle.header : "#fff",
              }}
            >
              {/* ── Column Header ── */}
              <div
                style={{
                  background: colStyle.header,
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: `1px solid ${colStyle.border}`,
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: colStyle.color,
                  }}
                >
                  {column}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    background: colStyle.color,
                    color: "#fff",
                    borderRadius: "10px",
                    padding: "1px 8px",
                  }}
                >
                  {colTasks.length}
                </span>
              </div>

              {/* ── Task Cards ── */}
              <div
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  minHeight: "200px",
                }}
              >
                {colTasks.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#9ca3af",
                      fontSize: "12px",
                      padding: "20px 0",
                      border: "2px dashed #e5e7eb",
                      borderRadius: "8px",
                    }}
                  >
                    Drop here
                  </div>
                )}

                {colTasks.map((task) => {
                  const epicName     = getEpicName(task.epicId);
                  const projectColor = getProjectColor(task.epicId);
                  const isDragging   = draggedTask?.id === task.id;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        cursor: "grab",
                        opacity: isDragging ? 0.4 : 1,
                        transform: isDragging ? "scale(0.98)" : "scale(1)",
                        transition: "opacity 0.15s ease, transform 0.15s ease",
                        boxShadow: isDragging
                          ? "none"
                          : "0 1px 3px rgba(0,0,0,0.06)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        borderLeft: `3px solid ${projectColor}`,
                      }}
                    >
                      {/* Task Name + Delete */}
                      <div className="d-flex justify-content-between align-items-start">
                        <span style={{ fontSize: "13px", fontWeight: 600, flex: 1 }}>
                          {task.name}
                        </span>
                        <button
                          className="btn btn-sm"
                          style={{
                            fontSize: "10px",
                            padding: "0px 5px",
                            color: "#ef4444",
                            lineHeight: 1.5,
                          }}
                          onClick={() => deleteTask(task.id)}
                        >
                          ✕
                        </button>
                      </div>

                      {/* Epic Badge */}
                      {epicName && (
                        <span
                          style={{
                            fontSize: "10px",
                            background: "#f3f4f6",
                            color: "#6b7280",
                            padding: "1px 7px",
                            borderRadius: "4px",
                            alignSelf: "flex-start",
                          }}
                        >
                          {epicName}
                        </span>
                      )}

                      {/* Priority + Move Buttons */}
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          style={{
                            ...PRIORITY_STYLES[task.priority],
                            fontSize: "10px",
                            fontWeight: 600,
                            padding: "2px 7px",
                            borderRadius: "4px",
                          }}
                        >
                          {task.priority}
                        </span>

                        {/* Quick move buttons */}
                        <div className="d-flex gap-1">
                          {column !== "To Do" && (
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              style={{ fontSize: "10px", padding: "1px 6px" }}
                              onClick={() => moveKanban(task.id,
                                column === "Done" ? "In Progress" : "To Do"
                              )}
                            >
                              ←
                            </button>
                          )}
                          {column !== "Done" && (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              style={{ fontSize: "10px", padding: "1px 6px" }}
                              onClick={() => moveKanban(task.id,
                                column === "To Do" ? "In Progress" : "Done"
                              )}
                            >
                              →
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* ── Footer Stats ── */}
      <div className="d-flex gap-3 mt-3">
        {COLUMNS.map((column) => {
          const count    = getColumnTasks(column).length;
          const colStyle = COLUMN_STYLES[column];
          return (
            <div
              key={column}
              className="flex-fill text-center border rounded p-2"
              style={{ background: colStyle.header }}
            >
              <div style={{ fontSize: "20px", fontWeight: 600, color: colStyle.color }}>
                {count}
              </div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>{column}</div>
            </div>
          );
        })}
      </div>

    </div>
  );
}