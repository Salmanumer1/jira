export default function Kanban() {
  return (
    <div>
      <h2>Kanban Board</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h3>To Do</h3>
          <p>Task 1</p>
          <p>Task 2</p>
        </div>

        <div>
          <h3>In Progress</h3>
          <p>Task 3</p>
        </div>

        <div>
          <h3>Done</h3>
          <p>Task 4</p>
        </div>
      </div>
    </div>
  );
}