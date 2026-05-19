import { Link } from "react-router-dom";
import "./sidebar.css";
export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-logo"><ion-icon name="logo-web-component" className="mx-2"></ion-icon>Collabuz</h2>

      <Link  className="sidebar-link" to="/"><ion-icon name="analytics-outline" className="mx-2"></ion-icon>Dashboard</Link>
      <Link  className="sidebar-link" to="/projects"><ion-icon name="card-outline" className="mx-2"></ion-icon>Projects</Link>
      <Link  className="sidebar-link" to="/epics"><ion-icon name="color-wand-outline" className="mx-2"></ion-icon>Epics</Link>
      <Link  className="sidebar-link" to="/stories"><ion-icon name="clipboard-outline" className="mx-2"></ion-icon>Stories</Link>
      <Link  className="sidebar-link" to="/tasks"><ion-icon name="library-outline" className="mx-2"></ion-icon>Tasks</Link>
      <Link className="sidebar-link" to="/kanban"><ion-icon name="albums-outline" className="mx-2"></ion-icon>Kanban</Link>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    height: "106vh",
    padding: "20px",
    background: "#111",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};