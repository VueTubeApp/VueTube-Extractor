import { Root, Type, loadSync } from "protobufjs";
import path from "path";

class Proto {
  private protoRoot: Root;
  constructor() {
    this.protoRoot = loadSync(path.join(__dirname, "youtube.proto"));
  }

  /**
   * encodes Visitor Data to protobuf format
   *
   * @param {string} id - visitor id. Should be an 11 character long random string
   * @param {number} timestamp - timestamp of initialization
   *
   * @returns {string} encoded visitor data
   */
  encodeVisitorData(id: string, timestamp: number): string {
    const visitorData: Type = this.protoRoot.lookupType("youtube.VisitorData");
    const buf: Uint8Array = visitorData.encode({ id, timestamp }).finish();
    return encodeURIComponent(Buffer.from(buf).toString("base64"));
  }
}

const singletonProto = new Proto();

Object.freeze(singletonProto);

export default singletonProto;
