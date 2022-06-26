import abstractParser from "../abstractParser";
import { continuation } from "../../types"

export default class Continuations extends abstractParser {
  parse(data: [{ [key: string]: any }]): continuation {
    const nextContinuationData = data.find((item) => item.nextContinuationData)
      ?.nextContinuationData.continuation;
    const reloadContinuationData = data.find(
      (item) => item.reloadContinuationData
    )?.reloadContinuationData.continuation;
    return {
      nextContinuationData,
      reloadContinuationData,
    };
  }
}