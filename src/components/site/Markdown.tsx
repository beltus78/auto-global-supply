import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => (part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part));
}

/** Minimal renderer for guide bodies: ## headings, paragraphs, bullet and numbered lists, **bold**. */
export function Markdown({ source }: { source: string }) {
  const out: ReactNode[] = [];
  const blocks = source.trim().split(/\n{2,}/);
  blocks.forEach((block, bi) => {
    const lines = block.split("\n");
    let i = 0;
    while (i < lines.length) {
      const line = lines[i]!;
      if (line.startsWith("## ")) {
        out.push(<h2 key={`${bi}-${i}`}>{line.slice(3)}</h2>);
        i++;
      } else if (/^- /.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^- /.test(lines[i]!)) items.push(lines[i++]!.slice(2));
        out.push(<ul key={`${bi}-${i}`}>{items.map((t) => <li key={t}>{inline(t)}</li>)}</ul>);
      } else if (/^\d+\. /.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\. /.test(lines[i]!)) items.push(lines[i++]!.replace(/^\d+\. /, ""));
        out.push(<ol key={`${bi}-${i}`}>{items.map((t) => <li key={t}>{inline(t)}</li>)}</ol>);
      } else {
        const para: string[] = [];
        while (i < lines.length && !/^(## |- |\d+\. )/.test(lines[i]!)) para.push(lines[i++]!);
        out.push(<p key={`${bi}-${i}`}>{inline(para.join(" "))}</p>);
      }
    }
  });
  return <div className="prose-ags">{out}</div>;
}
