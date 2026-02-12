import { launchBrowser } from "./browser";
import { promptAndGetResponse } from "./chat";
import { parseIdeas, parseNarration } from "./parser";
import { idea_02, idea_generate_01 as prompt1 } from "./prompts";
import { thinking_mode_btn } from "./selector";
import { sleep } from "./utls";

const { browser, page } = await launchBrowser();

// open chatgpt
await page.goto("https://chatgpt.com");

//enable thinking mode
await page.waitForSelector("#composer-plus-btn");
await page.click("#composer-plus-btn");
// await sleep(500);
await page.waitForSelector(thinking_mode_btn);
await page.click(thinking_mode_btn);

// idea generation part
const lastRawRes = await promptAndGetResponse(page, prompt1);
console.log("GOT RAW RESPONSE:", lastRawRes);
Bun.write(`logs/${Date.now()}`, lastRawRes!);

const ideas = parseIdeas(lastRawRes!);
console.log("PARSED IDEAS:", ideas);

const { title, hook, corePhysicsConflict, whyItWorks } = ideas.selected;
const prompt2 = idea_02
  .replaceAll("{{TITLE}}", `"${title}"`)
  .replaceAll("{{HOOK}}", `"${hook}"`)
  .replaceAll("{{CORE_PHYSICS_CONFLICT}}", `"${corePhysicsConflict}"`)
  .replaceAll("{{WHY_IT_WORKS}}", `"${whyItWorks}"`);

const rawNarationRes = await promptAndGetResponse(page, prompt2);
Bun.write(`logs/${Date.now()}`, rawNarationRes!);

const parsedScipt = parseNarration(rawNarationRes!);
console.log(parsedScipt);
