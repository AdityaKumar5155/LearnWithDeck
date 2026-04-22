const CardShell = ({ title, subtitle, children }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-lg font-semibold text-white">{title}</div>
        {subtitle ? <div className="mt-1 text-sm text-white/70">{subtitle}</div> : null}
      </div>
      {children}
    </div>
  );
};

export default CardShell;
