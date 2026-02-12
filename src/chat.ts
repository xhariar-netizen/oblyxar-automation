import type { Page } from "puppeteer";

export async function promptAndGetResponse(page: Page, prompt: string) {
  if (!prompt) throw new Error("prompt cant be empty!");

  await page.waitForSelector("#prompt-textarea");

  // clean prompt box
  await page.click("#prompt-textarea");
  await page.keyboard.down("Control");
  await page.keyboard.press("A");
  await page.keyboard.up("Control");
  await page.keyboard.press("Backspace");

  //type the prompt
  // await page.evaluate((text) => {
  //   const input = document.querySelector("#prompt-textarea") as HTMLElement;

  //   input.innerText = text;
  //   input.dispatchEvent(new Event("input", { bubbles: true }));
  // }, prompt);

  const lines = prompt.split("\n");
  for (let i = 0; i < lines.length; i++) {
    await page.keyboard.type(lines[i]!);

    if (i !== lines.length - 1) {
      await page.keyboard.down("Shift");
      await page.keyboard.press("Enter");
      await page.keyboard.up("Shift");
    }
  }

  await page.waitForSelector(
    '#composer-submit-button:not([aria-label="Stop streaming"])',
    { timeout: 0 },
  );
  await page.click("#composer-submit-button");

  await page.waitForSelector(
    "#thread-bottom > div > div > div.pointer-events-auto.relative.z-1.flex.h-\\(--composer-container-height\\,100\\%\\).max-w-full.flex-\\(--composer-container-flex\\,1\\).flex-col > form > div:nth-child(2) > div > div.flex.items-center.gap-2.\\[grid-area\\:trailing\\] > div > div > span > div > div > button",
    { timeout: 0 },
  );

  await page.waitForFunction(() => {
    const mds = document.querySelectorAll(".markdown");
    return mds.length > 0;
  });

  const lastResponseRaw = await page.$$eval(
    ".markdown",
    (mds) => mds[mds.length - 1]?.textContent,
  );

  return lastResponseRaw;
}
