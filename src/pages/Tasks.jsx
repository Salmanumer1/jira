// src/pages/Tasks.jsx

import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import "./tasks.css";

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

export default function Tasks() {
  const {
    taskList,
    epicList,
    addTask,
    updateTask,
    deleteTask,
    subtaskList,
    addSubtask,
    updateSubtask,
    deleteSubtask,
  } = useAppContext();

  const [showForm,     setShowForm]     = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const [subtaskInput, setSubtaskInput] = useState({});

  const [form, setForm] = useState({
    name:     "",
    priority: "Med",
    status:   "To Do",
    epicId:   "",
  });

  // ── Task Actions ──────────────────────────────────────────
  const handleAddTask = () => {
    if (!form.name.trim()) return;
    addTask({ ...form, epicId: Number(form.epicId) || null });
    setForm({ name: "", priority: "Med", status: "To Do", epicId: "" });
    setShowForm(false);
  };

  const handleDeleteTask = (id) => {
    deleteTask(id);
  };

  const handleUpdateStatus = (id, status) => {
    updateTask(id, { status });
  };

  // ── Subtask Actions ───────────────────────────────────────
  const handleAddSubtask = (taskId) => {
    const name = subtaskInput[taskId];
    if (!name?.trim()) return;
    addSubtask({ taskId, name, status: "To Do" });
    setSubtaskInput((prev) => ({ ...prev, [taskId]: "" }));
  };

  const handleToggleSubtask = (id, currentStatus) => {
    updateSubtask(id, {
      status: currentStatus === "Done" ? "To Do" : "Done",
    });
  };

  const handleDeleteSubtask = (id) => {
    deleteSubtask(id);
  };

  // ── Helpers ───────────────────────────────────────────────
  const getEpicName = (epicId) =>
    epicList.find((e) => e.id === epicId)?.name || "No Epic";

  const getSubtasks = (taskId) =>
    subtaskList.filter((s) => s.taskId === taskId);

  return (
    <div className="p-3">

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">Tasks</h4>
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

      {/* ── Task Cards ── */}
      <div className="row g-3">
        {taskList.length === 0 && (
          <div className="text-muted text-center py-4 col-12">
            No tasks yet. Click "+ Add Task" to create one.
          </div>
        )}

        {taskList.map((task) => {
          const subtasks   = getSubtasks(task.id);
          const isExpanded = expandedTask === task.id;
          const doneSubs   = subtasks.filter((s) => s.status === "Done").length;

          return (
            <div key={task.id} className="col-md-6 col-lg-4">
              <div className="border rounded p-3 bg-white h-100 d-flex flex-column gap-2">

                {/* ── Name + Delete ── */}
                <div className="d-flex justify-content-between align-items-start">
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>
                    {task.name}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    style={{ fontSize: "11px", padding: "1px 7px" }}
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    ✕
                  </button>
                </div>

                {/* ── Epic Name ── */}
                <span
                  style={{
                    fontSize: "11px",
                    background: "#f3f4f6",
                    color: "#6b7280",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    alignSelf: "flex-start",
                  }}
                >
                  {getEpicName(task.epicId)}
                </span>

                {/* ── Priority + Status ── */}
                <div className="d-flex gap-2 align-items-center">
                  <span
                    style={{
                      ...PRIORITY_STYLES[task.priority],
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {task.priority}
                  </span>

                  <select
                    className="form-select form-select-sm"
                    style={{ fontSize: "11px", width: "auto" }}
                    value={task.status}
                    onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>

                {/* ── Subtask progress bar ── */}
                {subtasks.length > 0 && (
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
                          width: `${(doneSubs / subtasks.length) * 100}%`,
                          height: "100%",
                          background: "#5b8cf5",
                          borderRadius: "2px",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "10px", color: "#6b7280" }}>
                      {doneSubs}/{subtasks.length} subtasks done
                    </span>
                  </div>
                )}

                {/* ── Subtask Toggle Button ── */}
                <button
                  className="btn btn-sm btn-outline-secondary w-100"
                  style={{ fontSize: "11px" }}
                  onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                >
                  {isExpanded ? "▲ Hide Subtasks" : "▼ Subtasks"}
                  {subtasks.length > 0 && (
                    <span className="ms-1 text-muted">
                      ({doneSubs}/{subtasks.length} done)
                    </span>
                  )}
                </button>

                {/* ── Subtasks Panel ── */}
                {isExpanded && (
                  <div className="border rounded p-2 bg-light d-flex flex-column gap-1">

                    {subtasks.length === 0 && (
                      <p className="text-muted m-0" style={{ fontSize: "12px" }}>
                        No subtasks yet.
                      </p>
                    )}

                    {subtasks.map((sub) => (
                      <div
                        key={sub.id}
                        className="d-flex justify-content-between align-items-center py-1"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="checkbox"
                            checked={sub.status === "Done"}
                            onChange={() =>
                              handleToggleSubtask(sub.id, sub.status)
                            }
                          />
                          <span
                            style={{
                              fontSize: "12px",
                              textDecoration:
                                sub.status === "Done" ? "line-through" : "none",
                              color:
                                sub.status === "Done" ? "#9ca3af" : "#111",
                            }}
                          >
                            {sub.name}
                          </span>
                        </div>

                        <span
                          className="ms-2"
                          style={{
                            ...STATUS_STYLES[sub.status],
                            fontSize: "10px",
                            padding: "1px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {sub.status}
                        </span>

                        <button
                          className="btn btn-sm ms-1"
                          style={{
                            fontSize: "10px",
                            padding: "1px 6px",
                            color: "#ef4444",
                          }}
                          onClick={() => handleDeleteSubtask(sub.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* ── Add Subtask Input ── */}
                    <div className="d-flex gap-1 mt-1">
                      <input
                        className="form-control form-control-sm"
                        style={{ fontSize: "12px" }}
                        placeholder="Add subtask..."
                        value={subtaskInput[task.id] || ""}
                        onChange={(e) =>
                          setSubtaskInput((prev) => ({
                            ...prev,
                            [task.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddSubtask(task.id)
                        }
                      />
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleAddSubtask(task.id)}
                      >
                        +
                      </button>
                    </div>

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