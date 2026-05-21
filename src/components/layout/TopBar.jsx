import "./topbar.css";
export default function TopBar(props) {
  return (
    <div className="topbar">
      <h3 className="topbar-title">
        <ion-icon name="logo-web-component"></ion-icon>
        {props.name} Managment System
      </h3>
    </div>
  );
}

const styles = {
  topbar: {
    padding: "15px",
    background: "#f5f5f5",
    borderBottom: "1px solid #ddd",
  },
};