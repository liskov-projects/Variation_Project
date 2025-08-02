export default function CustomRadioButton({ selected, setSelected, option }) {
  return (
    <button
      className={`btn btn-outline-success btn-lg d-flex align-items-center justify-content-center${
        selected === option ? " active" : ""
      }`}
      style={{ minHeight: "80px", position: "relative", minWidth: "160px" }}
      type="button"
      onClick={() => setSelected(option)}
    >
      <div>
        <i className="bi bi-person-check fs-3 d-block mb-2"></i>
        <strong>{option}</strong>
      </div>
      <input
        type="radio"
        name="GroupSelection"
        value={option}
        checked={selected === option}
        onChange={() => setSelected(option)}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          width: 0,
          height: 0,
        }}
        tabIndex={-1}
        aria-hidden="true"
      />
    </button>
  );
}
