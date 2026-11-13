import { Fragment } from "react";

/**
 * Text split for GSAP reveals. React owns every node, so language
 * switches re-render cleanly. Screen readers get the whole string once.
 */
export function Chars({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <Fragment key={`${word}-${w}`}>
            {/* Each word is unbreakable, so lines only wrap between words. */}
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, i) => (
                <span key={i} className="mask">
                  <span data-char="">{char}</span>
                </span>
              ))}
            </span>
            {w < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}

export function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="mask">
            <span data-word="">{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
