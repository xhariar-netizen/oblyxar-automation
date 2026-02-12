import { launchBrowser } from "./browser";
import { promptAndGetResponse } from "./chat";
import { parseIdeas } from "./parser";
import { idea_generate_01 } from "./prompts";

const { browser, page } = await launchBrowser();

// open chatgpt
await page.goto("https://chatgpt.com");


// idea generation part
const lastRawRes = await promptAndGetResponse(page, idea_generate_01);
console.log("GOT RAW RESPONSE:", lastRawRes);
Bun.write(`logs/${Date.now()}.txt`, lastRawRes);

const      ideas = parseIdeas(lastRawRes);
console.log("PARSED IDEAS:", ideas);
Bun.write(`logs/${Date.now()}.txt`, JSON.stringify(ideas));




