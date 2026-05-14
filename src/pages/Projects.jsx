import Button from "../components/ui/Button";

export default function Projects() {
  return (
    <div>
      <h2>Projects</h2>
      <Button>Create Project</Button>

      <div style={{ marginTop: "20px" }}>
        <p>Project 1 - Active</p>
        <p>Project 2 - Completed</p>
      </div>
    </div>
  );
}