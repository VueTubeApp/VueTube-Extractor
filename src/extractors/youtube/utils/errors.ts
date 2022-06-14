import { utilityErrors } from "@utils";

/**
 * @class General error class for the YouTube extractor. It is recommended to extend this class for more detailed error names.
 */
class YoutubeError extends utilityErrors.VueTubeExtractorError { }

/**
 * @abstract Errors for http requests.
 *
 * @param {string} id - the id of the video
 */
abstract class PageError extends YoutubeError {
  id: string;
  constructor(id: string, message: string, details?: unknown) {
    super(message, details);
    Object.setPrototypeOf(this, PageError.prototype);
    this.id = id;
  }
}

abstract class VideoError extends PageError { }

class AgeRestrictionError extends VideoError { }
class VideoNotFoundError extends VideoError { }
class VideoNotAvailableError extends VideoError { }
class NoStreamingDataError extends VideoError { }

abstract class PlaylistError extends PageError { }
class PlaylistNotFoundError extends PlaylistError { }
class PlaylistNotAvailableError extends PlaylistError { }

abstract class ChannelError extends PageError { }
class ChannelNotFoundError extends ChannelError { }
class ChannelNotAvailableError extends ChannelError { }

class ExtractorNotReadyError extends utilityErrors.ExtractorNotReadyError { }

class ParserError extends YoutubeError { }
class LoginRequiredError extends YoutubeError { }

class EndOfPageError extends YoutubeError { }
/**
 * @class Errors for search requests.
 *
 * @param {string} query - the query of the search
 */
class SearchError extends YoutubeError {
  query: string;
  constructor(query: string, message: string, details?: unknown) {
    super(message, details);
    Object.setPrototypeOf(this, SearchError.prototype);
    this.query = query;
  }
}

/**
 * @class Error for initializing the extractor.
 *
 * @param {number} trials - the number of trials
 */
class InitializationError extends YoutubeError {
  trials?: number;
  constructor(message: string, details?: unknown, trials?: number) {
    super(message, details);
    Object.setPrototypeOf(this, InitializationError.prototype);
    this.trials = trials;
  }
}

export default {
  YoutubeError,
  AgeRestrictionError,
  VideoNotFoundError,
  VideoNotAvailableError,
  NoStreamingDataError,
  PlaylistNotFoundError,
  PlaylistNotAvailableError,
  ChannelNotFoundError,
  ChannelNotAvailableError,
  SearchError,
  InitializationError,
  ExtractorNotReadyError,
  ParserError,
  LoginRequiredError,
  EndOfPageError,
};
