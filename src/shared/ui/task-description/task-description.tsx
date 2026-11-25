import { TheoryHint } from "@/shared/consts/theory-hints-config";
import { TheoryTerm } from "@/shared/ui/theory-term/theory-term";

type TaskDescriptionProps = {
  text?: string;
  hint?: TheoryHint;
};

export const TaskDescription = ({ text, hint }: TaskDescriptionProps) => {
  if (!text || !hint) {
    return <>{text}</>;
  }

  const index = text.indexOf(hint.phrase);
  if (index === -1) {
    return <>{text}</>;
  }

  return (
    <>
      {text.slice(0, index)}
      <TheoryTerm term={hint.term}>{hint.phrase}</TheoryTerm>
      {text.slice(index + hint.phrase.length)}
    </>
  );
};
