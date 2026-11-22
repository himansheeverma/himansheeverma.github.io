/*
  ===========================================================
   CODE DIARY: YAHAN APNE PROGRAMS ADD KARO  ✨
  ===========================================================
  Naya program add karne ke 2 steps:
   1. Apni .c file "programs" folder mein daalo (jaise programs/star-patterns.c)
   2. Neeche list mein ek naya { ... } block jodo.

  - date:   "YYYY-MM-DD" format mein (page apne aap naye se purane order mein dikhata hai)
  - title:  Program ka naam
  - file:   .c file ka path
  - desc:   1-2 line mein program kya karta hai
  - tags:   Topics (loops, arrays, functions...)
  - input:  Program ko kya input chahiye. label = box ka naam, value = default input
            Agar program input nahi leta, to input: null likho
            Ek se zyada input ho to value mein space ya new line (\n) se alag karo, jaise "5 10"
*/

const PROGRAMS = [
  {
    date: "2026-11-21",
    title: "Star Patterns",
    file: "programs/star-patterns.c",
    desc: "Nested loops se 5 patterns: right triangle, inverted triangle, pyramid, diamond aur hollow square. Rows ki ginti aap khud chuno!",
    tags: ["Nested loops", "Functions", "scanf"],
    input: { label: "Number of rows", value: "5" },
  },
];
