// Universe Framework: entry point
// Run with:  node index.js
// Optional:  node index.js 2026-10-26 01:49 "Your Name"

const { FOUNDATION, VISION } = require("./numerology/constants");
const engine = require("./numerology/engine");

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

const [dateArg = today, timeArg = time, nameArg = FOUNDATION.BUILDER] = process.argv.slice(2);

const show = (label, r) =>
  console.log(`${label.padEnd(8)} ${r.total.steps.join(" -> ")}  =  ${r.total.value}  ${engine.meaning(r.total.value)}`);

console.log(`\n  ${VISION.description}\n`);

const d = engine.fromDate(dateArg);
console.log(`Date     ${dateArg}   (month-day-year ${d.pattern})`);
show("", d);

show(`Time`, engine.fromTime(timeArg));
console.log(`         ${timeArg}`);

show(`Name`, engine.fromName(nameArg));
console.log(`         ${nameArg}`);

const deploy = new Date(FOUNDATION.DEPLOYMENT_DATE);
const daysLeft = Math.ceil((deploy - new Date(today)) / 86400000);
console.log(`\nDeploy   ${FOUNDATION.DEPLOYMENT_DATE}  (${engine.fromDate(FOUNDATION.DEPLOYMENT_DATE).pattern})  in ${daysLeft} days\n`);
