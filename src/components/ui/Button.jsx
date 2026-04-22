import cx from "../../lib/cx";

const Button = ({ variant = "primary", className, ...props }) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";

  const styles = {
    primary: "bg-white text-slate-900 hover:bg-white/90",
    ghost: "bg-white/10 text-white hover:bg-white/15",
    danger: "bg-rose-500/90 text-white hover:bg-rose-500",
  };

  return <button className={cx(base, styles[variant], className)} {...props} />;
};

export default Button;
