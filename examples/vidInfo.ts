import { YouTube } from "../src";
import util from "util";
const fetch = require("isomorphic-fetch"); // So that fetch is available in the test environment. This will not be needed if using node 18.

async function getVid(query: string) {
  const youtube = await new YouTube().init();
  const result = await youtube.getVideoDetails(query);
  console.log(util.inspect(result, false, null, true));
}

getVid("9FaFMHqpKGY").catch((error) => {
  console.error(error);
});
