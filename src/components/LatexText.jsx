import katex from "katex";

const tokenizeLatex = (input) => {
  const text = String(input ?? "");
  const tokens = [];

  let i = 0;
  while (i < text.length) {
    const nextDollar = text.indexOf("$", i);
    if (nextDollar === -1) {
      tokens.push({ type: "text", value: text.slice(i) });
      break;
    }

    if (nextDollar > i) {
      tokens.push({ type: "text", value: text.slice(i, nextDollar) });
    }

    const isDisplay = text[nextDollar + 1] === "$";
    const delimiter = isDisplay ? "$$" : "$";
    const start = nextDollar + delimiter.length;

    const end = text.indexOf(delimiter, start);
    if (end === -1) {
      // No closing delimiter; treat the rest as plain text.
      tokens.push({ type: "text", value: text.slice(nextDollar) });
      break;
    }

    const expr = text.slice(start, end);
    tokens.push({ type: "math", value: expr, display: isDisplay });
    i = end + delimiter.length;
  }

  return tokens;
};

const renderTextWithNewlines = (value) => {
  const parts = String(value ?? "").split("\n");
  if (parts.length === 1) return parts[0];
  return parts.map((p, idx) => (
    // eslint-disable-next-line react/no-array-index-key
    <span key={idx}>
      {p}
      {idx < parts.length - 1 ? <br /> : null}
    </span>
  ));
};

const LatexText = ({ text, className }) => {
  const tokens = tokenizeLatex(text);

  return (
    <div className={className}>
      {tokens.map((t, idx) => {
        if (t.type === "text") {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <span key={idx}>{renderTextWithNewlines(t.value)}</span>
          );
        }

        const html = katex.renderToString(String(t.value ?? ""), {
          throwOnError: false,
          displayMode: Boolean(t.display),
        });

        if (t.display) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={idx} className="my-2 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
          );
        }

        return (
          // eslint-disable-next-line react/no-array-index-key
          <span key={idx} dangerouslySetInnerHTML={{ __html: html }} />
        );
      })}
    </div>
  );
};

export default LatexText;
