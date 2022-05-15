/**
 * The abstract parser class. Implement this class to create a new parser.
 */
export default abstract class YouTubeParser {
  public abstract parse(data: Record<string, unknown>): void;
}
