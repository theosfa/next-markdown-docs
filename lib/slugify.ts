export function slugify(str: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh",
    щ: "shch", ы: "y", э: "e", ю: "yu", я: "ya", ъ: "", ь: ""
  };

  return str
    .toLowerCase()
    .replace(/[а-яё]/gi, (char) => map[char] || "") // transliterate Russian
    .replace(/\s+/g, "-")       // replace spaces with -
    .replace(/[^\w\-]+/g, "")   // remove non-word characters
    .replace(/\-\-+/g, "-")     // collapse multiple hyphens
    .replace(/^-+|-+$/g, "");   // trim hyphens
}