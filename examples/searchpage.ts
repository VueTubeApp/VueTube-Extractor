import { YouTube } from "../src";
import util from "util";
const fetch = require("isomorphic-fetch"); // So that fetch is available in the test environment

async function getSearch(query:string) {
  const youtube = await new YouTube().init();
  const result = await youtube.getSearchPage(query);
  console.log(util.inspect(result, false, null, true));
}

getSearch("LTT");
