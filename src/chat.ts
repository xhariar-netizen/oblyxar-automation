import type { Page } from "puppeteer";
import { sleep } from "./utls";

export async function promptAndGetResponse(page: Page, prompt: string) {
    await page.waitForSelector("#prompt-textarea");

    await page.evaluate((text) => {
        const input = document.querySelector("#prompt-textarea") as HTMLElement;

        input.innerText = text;
        input.dispatchEvent(new Event("input", { bubbles: true }));
    }, prompt);

    await page.waitForSelector('#composer-submit-button:not([aria-label="Stop streaming"])');
    await page.click("#composer-submit-button");


    // <button type="button" aria-label="Start Voice" class="composer-submit-button-color text-submit-btn-text flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:opacity-70 focus-visible:outline-black focus-visible:outline-none disabled:text-[#f4f4f4] disabled:opacity-30 dark:focus-visible:outline-white" style="view-transition-name: var(--vt-composer-speech-button);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden="true" class="h-5 w-5"><use href="/cdn/assets/sprites-core-jvvyb0fs.svg#f8aa74" fill="currentColor"></use></svg></button>




    await page.waitForSelector("#thread-bottom > div > div > div.pointer-events-auto.relative.z-1.flex.h-\\(--composer-container-height\\,100\\%\\).max-w-full.flex-\\(--composer-container-flex\\,1\\).flex-col > form > div:nth-child(2) > div > div.flex.items-center.gap-2.\\[grid-area\\:trailing\\] > div > div > span > div > div > button")

    await page.waitForFunction(() => {
        const mds = document.querySelectorAll(".markdown");
        return mds.length > 0;
    });

    const lastResponseRaw = await page.$$eval(".markdown", mds =>
        mds[mds.length - 1].textContent
    );

    return lastResponseRaw;
}