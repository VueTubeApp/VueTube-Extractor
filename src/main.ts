import proto from "./extractors/youtube/proto";

// function to create a random string of length n:
function randomString(n: number): string {
  return Math.random()
    .toString(36)
    .substring(2, n + 2);
}

console.log(proto.encodeVisitorData(randomString(11), Date.now()));
