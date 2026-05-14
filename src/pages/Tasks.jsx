// src/pages/Tasks.jsx

import { useState } from "react";
import { tasks as initialTasks, epics } from "../data/mockData";

const PRIORITY_STYLES = {
  High: { background: "#fee2e2", color: "#b91c1c" },
  Med:  { background: "#fef3c7", color: "#92400e" },
  Low:  { background: "#dcfce7", color: "#166534" },
};

export default function Tasks() {
  const [taskList,    setTaskList]    = useState(initialTasks);
  const [subtaskList, setSubtaskList] = useState([]);
  const [showForm,    setShowForm]    = useState(false);
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
    setTaskList((prev) => [
      ...prev,
      { id: prev.length + 1, ...form, epicId: Number(form.epicId) },
    ]);
    setForm({ name: "", priority: "Med", status: "To Do", epicId: "" });
    setShowForm(false);
  };

  const handleDeleteTask = (id) => {
    setTaskList((prev) => prev.filter((t) => t.id !== id));
    setSubtaskList((prev) => prev.filter((s) => s.taskId !== id));
  };

  const handleUpdateStatus = (id, status) => {
    setTaskList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  // ── Subtask Actions ───────────────────────────────────────
  const handleAddSubtask = (taskId) => {
    const name = subtaskInput[taskId];
    if (!name?.trim()) return;
    setSubtaskList((prev) => [
      ...prev,
      { id: prev.length + 1, taskId, name, status: "To Do" },
    ]);
    setSubtaskInput((prev) => ({ ...prev, [taskId]: "" }));
  };

  const handleToggleSubtask = (id, currentStatus) => {
    setSubtaskList((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: currentStatus === "Done" ? "To Do" : "Done" }
          : s
      )
    );
  };

  const handleDeleteSubtask = (id) => {
    setSubtaskList((prev) => prev.filter((s) => s.id !== id));
  };

  // ── Helpers ───────────────────────────────────────────────
  const getEpicName = (epicId) =>
    epics.find((e) => e.id === epicId)?.name || "No Epic";

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
                {epics.map((epic) => (
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
          <div className="text-muted text-center py-4">
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

                {/* Name + Delete */}
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

                {/* Epic Name */}
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

                {/* Priority + Status */}
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

                {/* Subtask Toggle Button */}
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

                {/* Subtasks Panel */}
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
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="checkbox"
                            checked={sub.status === "Done"}
                            onChange={() => handleToggleSubtask(sub.id, sub.status)}
                          />
                          <span
                            style={{
                              fontSize: "12px",
                              textDecoration: sub.status === "Done" ? "line-through" : "none",
                              color: sub.status === "Done" ? "#9ca3af" : "#111",
                            }}
                          >
                            {sub.name}
                          </span>
                        </div>
                        <button
                          className="btn btn-sm"
                          style={{ fontSize: "10px", padding: "1px 6px", color: "#ef4444" }}
                          onClick={() => handleDeleteSubtask(sub.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* Add Subtask */}
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