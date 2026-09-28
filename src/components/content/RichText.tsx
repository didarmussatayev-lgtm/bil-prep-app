import ui from "@/components/student/ui.module.css";

/**
 * ШАГ 6 (последний кусок): {a/b} и {w a/b} теперь настоящие дроби — числитель над
 * знаменателем с чертой, без сырого LaTeX-синтаксиса (KaTeX для формул сложнее дробей
 * пока не подключён — этого в контенте раздела I пока и не встречается).
 * Разбор — по docs/content-format.md: {a/b} режется по ПОСЛЕДНЕМУ "/" внутри скобок
 * (числитель/знаменатель могут быть выражениями: {2+3/7}), {w a/b} — целая часть,
 * пробел, дробь (регэксп ^\d+ \d+/\d+$).
 */

type FractionToken = { whole?: string; num: string; denom: string };

function parseFractionToken(raw: string): FractionToken | null {
  const trimmed = raw.trim();
  const mixed = /^(-?\d+)\s+(-?\d+)\/(-?\d+)$/.exec(trimmed);
  if (mixed) return { whole: mixed[1], num: mixed[2], denom: mixed[3] };

  const slash = trimmed.lastIndexOf("/");
  if (slash <= 0 || slash === trimmed.length - 1) return null;
  const num = trimmed.slice(0, slash).trim();
  const denom = trimmed.slice(slash + 1).trim();
  return num && denom ? { num, denom } : null;
}

function Fraction({ token }: { token: FractionToken }) {
  return (
    <span className={ui.fraction}>
      {token.whole !== undefined && <span className={ui.fractionWhole}>{token.whole}</span>}
      <span className={ui.fractionStack}>
        <span className={ui.fractionNum}>{token.num}</span>
        <span className={ui.fractionDenom}>{token.denom}</span>
      </span>
    </span>
  );
}

const FRACTION_RE = /(\{[^{}]+\})/g;

function withFractions(text: string, keyPrefix: string): React.ReactNode[] {
  return text
    .split(FRACTION_RE)
    .filter((part) => part !== "")
    .map((part, i) => {
      const key = `${keyPrefix}-${i}`;
      if (part.startsWith("{") && part.endsWith("}")) {
        const token = parseFractionToken(part.slice(1, -1));
        if (token) return <Fraction key={key} token={token} />;
      }
      return <span key={key}>{part}</span>;
    });
}

/** Инлайн-рендер одной строки (жирный `**...**` + дроби `{a/b}`) — без блочной обёртки,
 *  чтобы можно было вставить внутрь уже существующего <p>/<span> (см. TestResult.tsx). */
export function renderRichInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((part) => part !== "")
    .map((part, i) => {
      const key = `${keyPrefix}-${i}`;
      return part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
        <strong key={key}>{withFractions(part.slice(2, -2), key)}</strong>
      ) : (
        <span key={key}>{withFractions(part, key)}</span>
      );
    });
}

export function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className={ui.richText}>
      {lines.map((line, i) => (
        <p key={i} style={{ margin: i === 0 ? 0 : "0.5em 0 0" }}>
          {renderRichInline(line, `l${i}`)}
        </p>
      ))}
    </div>
  );
}
