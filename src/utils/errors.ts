import package_json from "~/../package.json";

/**
 * Base error class. Extend this class for custom errors.
 * @abstract VueTubeExtractorError
 * @extends {Error} The base error class.
 *
 * @property {string} message - Error message
 * @property {number} timestamp - The timestamp when the error occurred
 * @property {string} process - The process that created the error
 * @property {string} version - The version of the package
 * @property {string} details - The details of the error/additional information
 */
abstract class VueTubeExtractorError extends Error {
  timestamp: number;
  process: string;
  version: string;
  details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.timestamp = Date.now();
    this.process = process.title;
    this.version = package_json.version;
    this.details = details;
  }
}

class ExtractorNotReadyError extends VueTubeExtractorError {}

export default { VueTubeExtractorError, ExtractorNotReadyError };
