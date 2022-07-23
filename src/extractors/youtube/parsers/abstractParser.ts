/**
 * The abstract parser class. Extend this class to create a new parser.
 */
export default abstract class YouTubeParser {
  abstract parse(data: any): object;
}

export interface parsersList {
  [key: string]: Pick<typeof YouTubeParser, keyof typeof YouTubeParser> &
    (new () => YouTubeParser);
}
