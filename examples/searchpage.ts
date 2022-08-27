import { YouTube } from "../src";
import util from "util";
const fetch = require("isomorphic-fetch"); // So that fetch is available in the test environment. This will not be needed if using node 18.

async function getSearch(query: string) {
  const youtube = await new YouTube().init();
  const result = await youtube.getSearchPage(query);
  console.log(util.inspect(result, false, null, true));
  if (result?.continue) {
    const searchContinued = await result.continue();
    console.log(util.inspect(searchContinued, false, null, true));
  }

}

getSearch("LTT").catch(error => {console.error(error);});
