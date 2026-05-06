export function normalizeText(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/0/g, "o")
      .replace(/1/g, "i")
      .replace(/3/g, "e")
      .replace(/4|@/g, "a")
      .replace(/5/g, "s")
      .replace(/7/g, "t")
      .replace(/8/g, "b")
      .replace(/(.)\1+/g, "$1")
  );
}
