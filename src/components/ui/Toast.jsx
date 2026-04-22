import cx from "../../lib/cx";

const Toast = ({ kind = "info", message, onClose }) => {
  if (!message) return null;
  const tone =
    kind === "error"
      ? "border-rose-500/30 bg-rose-500/10 text-rose-100"
      : "border-white/10 bg-white/5 text-white";
  return (
    <div className={cx("rounded-2xl border px-4 py-3 text-sm", tone)}>
      <div className="flex items-start justify-between gap-3">
        <div className="leading-5">{message}</div>
        <button
          className="-mt-0.5 rounded-lg px-2 py-1 text-white/70 hover:bg-white/10 hover:text-white"
          onClick={onClose}
          type="button"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
