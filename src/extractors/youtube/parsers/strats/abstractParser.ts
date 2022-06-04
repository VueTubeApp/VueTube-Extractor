/**
 * The abstract parser class. Extend this class to create a new parser.
 */
export default interface YouTubeParser {
  parse(data: any): object;
}
