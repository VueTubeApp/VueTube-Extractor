/**
 * The abstract parser class. Extend this class to create a new parser.
 */
export default abstract class YouTubeParser {
  public parse(data: any): object {
    return this.parseOperation(data);
  }
  protected abstract parseOperation(data: any): object;
}
