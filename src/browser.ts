import puppeteer, { Browser, Page } from "puppeteer";

// const dataDir = "C:\\Users\\n\\AppData\\Local\\Google\\Chrome\\User Data";

// export async function launchBrowser(): Promise<{ browser: Browser; page: Page }> {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//     executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
//     args: [`--user-data-dir=${dataDir}`, `--profile-directory=Default`],
//   });

//   const page = await browser.newPage();

//   return { browser, page };
// }

const dataDir = "C:\\Users\\n\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data";

export async function launchBrowser(): Promise<{ browser: Browser; page: Page }> {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath: "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
    args: [`--user-data-dir=${dataDir}`],
  });

  const page = await browser.newPage();

  return { browser, page };
}