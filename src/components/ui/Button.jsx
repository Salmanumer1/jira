export default function Button({ children, onClick }) {
  return (
    <button className="btn btn-warning" onClick={onClick}>
      {children}
    </button>
  );
}