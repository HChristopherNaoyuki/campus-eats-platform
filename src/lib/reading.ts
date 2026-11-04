/**
 * Reading-time helpers shared by the polished public pages.
 *
 * The estimate uses a 200 words-per-minute pace, the common default for
 * on-screen reading of dense reference text such as legal copy.
 */
const WORDS_PER_MINUTE = 200;

const WORD_PATTERN = /[A-Za-z0-9'’-]+/g;

/** Number of minutes a reader needs for the supplied copy (never below one). */
export function estimateReadingMinutes(text: string): number
{
  const words = text.match(WORD_PATTERN)?.length ?? 0;
  if (words === 0) return 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Total minutes across several copy fragments (page sections in order). */
export function estimateReadingMinutesAll(fragments: string[]): number
{
  return estimateReadingMinutes(fragments.join(" "));
}
