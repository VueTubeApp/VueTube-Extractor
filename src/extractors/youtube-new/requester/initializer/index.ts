import Config from "./config";

export default class Initializer {
  private config_: Config;

  async init() {
    this.config_ = await new Config().getDefaultConfig();
  }
}
