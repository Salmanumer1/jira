export default function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <span><h3>{title}</h3></span>
      <p>{value}</p>
    </div>
  );
}

const styles = {
  card: {
  whiteSpace: "nowrap",
    padding: "15px",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "200px",

  },
};