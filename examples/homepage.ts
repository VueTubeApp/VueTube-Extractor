import { YouTube } from "../src";
import util from "util";
const fetch = require("isomorphic-fetch"); // So that fetch is available in the test environment. This will not be needed if using node 18.

async function getHomePage() {
    const youtube = await new YouTube().init();
    const homePage = await youtube.getHomePage();
    console.log(util.inspect(homePage, false, null, true));
    if (homePage?.continue) {
        const homePageContinued = await homePage.continue();
        console.log(util.inspect(homePageContinued, false, null, true));
    }
}

getHomePage().catch((error) => {
  console.error(error);
});