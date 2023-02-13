import { utilityErrors } from "@utils";

/**
 * @class General error class for the YouTube extractor. It is recommended to extend this class for more detailed error names.
 */
export class YoutubeError extends utilityErrors.VueTubeExtractorError { }

/**
 * @abstract Errors for http requests.
 *
 * @param {string} id - the id of the video
 */
abstract class PageError extends YoutubeError {
  id: string;
  constructor(id: string, message: string, details?: unknown) {
    super(message, details);
    // Object.setPrototypeOf(this, PageError.prototype);
    this.id = id;
  }
}

abstract class VideoError extends PageError { }

export class AgeRestrictionError extends VideoError { }
export class VideoNotFoundError extends VideoError { }
export class VideoNotAvailableError extends VideoError { }
export class NoStreamingDataError extends VideoError { }

abstract class PlaylistError extends PageError { }
export class PlaylistNotFoundError extends PlaylistError { }
export class PlaylistNotAvailableError extends PlaylistError { }

abstract class ChannelError extends PageError { }
export class ChannelNotFoundError extends ChannelError { }
export class ChannelNotAvailableError extends ChannelError { }

export class ExtractorNotReadyError extends utilityErrors.ExtractorNotReadyError { }

export class ParserError extends YoutubeError { }
export class LoginRequiredError extends YoutubeError { }

export class EndOfPageError extends YoutubeError { }
/**
 * @class Errors for search requests.
 *
 * @param {string} query - the query of the search
 */
export class SearchError extends YoutubeError {
  query: string;
  constructor(query: string, message: string, details?: unknown) {
    super(message, details);
    // Object.setPrototypeOf(this, SearchError.prototype);
    this.query = query;
  }
}

/**
 * @class Error for initializing the extractor.
 *
 * @param {number} trials - the number of trials
 */
export class InitializationError extends YoutubeError {
  trials?: number;
  constructor(message: string, details?: unknown, trials?: number) {
    super(message, details);
    Object.setPrototypeOf(this, InitializationError.prototype);
    this.trials = trials;
  }
}
