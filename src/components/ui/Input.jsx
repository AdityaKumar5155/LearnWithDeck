import cx from "../../lib/cx";

const Input = ({ className, ...props }) => (
  <input
    className={cx(
      "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25",
      className
    )}
    {...props}
  />
);

export default Input;
