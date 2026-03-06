/**
 * Verified, stable URLs for resources. Gemini must only reference these
 * or official docs roots — never invent or guess URLs.
 */
export const RESOURCE_WHITELIST: Record<string, string> = {
  // === DOCS (always stable) ===
  "official-docs":
    "Always link to the official documentation homepage only",

  // === FREE COURSES ===
  freecodecamp: "https://www.freecodecamp.org/learn",
  "the-odin-project": "https://www.theodinproject.com",
  cs50: "https://cs50.harvard.edu/web/2023/",
  "roadmap-sh": "https://roadmap.sh",
  exercism: "https://exercism.org",
  leetcode: "https://leetcode.com",
  "kaggle-learn": "https://www.kaggle.com/learn",

  // === YOUTUBE CHANNELS (link to channel, not specific video) ===
  fireship: "https://www.youtube.com/@Fireship",
  "traversy-media": "https://www.youtube.com/@TraversyMedia",
  "the-primeagen": "https://www.youtube.com/@ThePrimeagen",
  theo: "https://www.youtube.com/@t3dotgg",
  "techworld-nana": "https://www.youtube.com/@TechWorldwithNana",
  "hussein-nasser": "https://www.youtube.com/@hnasr",
  "arjan-codes": "https://www.youtube.com/@ArjanCodes",
  "network-chuck": "https://www.youtube.com/@NetworkChuck",
  "web-dev-simplified": "https://www.youtube.com/@WebDevSimplified",
  "code-with-antonio": "https://www.youtube.com/@codewithantonio",

  // === BOOKS ===
  "open-library": "https://openlibrary.org",

  // === PRACTICE ===
  codecrafters: "https://codecrafters.io",
  frontendmentor: "https://www.frontendmentor.io",
};
