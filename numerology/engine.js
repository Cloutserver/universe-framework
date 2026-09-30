// Numerology Engine
// Turns dates, times and names into their numbers.
// Written to be read: every function is small and explained, so it can be taught.

const { NUMEROLOGY } = require("./constants");

// Master numbers are never reduced further.
const MASTERS = [NUMEROLOGY.ELEVEN, NUMEROLOGY.TWENTY_TWO, NUMEROLOGY.THIRTY_THREE];

// Add up the digits of a number once.  1992 -> 1+9+9+2 = 21
function digitSum(n) {
  return String(Math.abs(n))
    .split("")
    .reduce((sum, d) => sum + Number(d), 0);
}

// Keep adding digits until one digit is left (or a master number appears).
// 2026 -> 10 -> 1      29 -> 11 (master, stop)
function reduce(n, { keepMasters = true } = {}) {
  let steps = [n];
  while (n > 9 && !(keepMasters && MASTERS.includes(n))) {
    n = digitSum(n);
    steps.push(n);
  }
  return { value: n, steps, master: MASTERS.includes(n) };
}

// A date, read in parts: day, month, year each reduced, then all together.
// "2026-10-26" -> day 26->8, month 10->1, year 2026->1, total 1+8+1 = 10 -> 1
function fromDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const d = reduce(day).value;
  const m = reduce(month).value;
  const y = reduce(year).value;
  return {
    date: isoDate,
    parts: { day: d, month: m, year: y },
    pattern: `${m}-${d}-${y}`,
    total: reduce(d + m + y),
  };
}

// A time of day.  "01:49" -> 1+4+9 = 14 -> 5
function fromTime(hhmm) {
  const digits = Number(hhmm.replace(":", ""));
  return { time: hhmm, total: reduce(digitSum(digits)) };
}

// Letterology: the Pythagorean table.  A=1 ... I=9, J=1 ... R=9, S=1 ... Z=8
function letterValue(ch) {
  const code = ch.toUpperCase().charCodeAt(0) - 64; // A=1, B=2 ...
  if (code < 1 || code > 26) return 0;              // spaces, dots, numbers: skip
  return ((code - 1) % 9) + 1;
}

function fromName(name) {
  const letters = name.split("").map((ch) => ({ ch, value: letterValue(ch) }))
    .filter((l) => l.value > 0);
  const sum = letters.reduce((s, l) => s + l.value, 0);
  return { name, letters, sum, total: reduce(sum) };
}

// What each number stands for inside this framework.
const MEANING = {
  1: "Beginning, creation",
  2: "Balance, partnership",
  3: "Bridge, synthesis, the mediator",
  4: "Structure, foundation, order",
  5: "Freedom, change, dissolution",
  6: "Care, community, responsibility",
  7: "Inner knowing, study, the seeker",
  8: "Infinity, cycles, material power",
  9: "Completion, fulfillment",
  11: "Master number: intuition",
  22: "Master number: the builder",
  33: "Master number: the teacher",
};

function meaning(n) {
  return MEANING[n] || "";
}

module.exports = { digitSum, reduce, fromDate, fromTime, fromName, meaning, MASTERS };
