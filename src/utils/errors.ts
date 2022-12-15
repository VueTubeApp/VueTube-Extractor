import package_json from "@package";

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
class VueTubeExtractorError extends Error {
    timestamp: number;
    nodeJSVersion: string;
    version: string;
    platform: string;
    details?: unknown;

    constructor(message: string, details?: unknown) {
        super(message);
        this.timestamp = Date.now();
        this.nodeJSVersion = process.version;
        this.version = package_json.version;
        this.platform = process.platform;
        this.details = details;
    }
}

class ExtractorNotReadyError extends VueTubeExtractorError {
}

/*
* Class for storing error message strings as well as helper functions to generate error messages
 */
export class ErrorMessages {
    static readonly unknownError = "An unknown error occurred. How did you even get here?";
    static readonly extractorNotReady = (extractorName: string) => `The extractor ${extractorName} is not ready. Please wait for it to finish initializing.`;
    static readonly invalidTypeGuard = (typeGuard: string) => `${typeGuard} is not a valid type guard. Please check the type guard you are using.`;
    static readonly typeGuardMismatch = (expected: string, actual: string, key?: string) => ErrorMessages.appendAdditionalInfoIfPresent('Type guard mismatch', key ? ` when checking key ${key}` : '', '.', `Expected ${expected}, got ${actual}.`);
    static readonly ruleTypeMismatch = (expected: string, actual: string) => `Rule type mismatch. Expected ${expected}, got ${actual}.`;
    static readonly invalidRuleType = (expected: string, actual: string) => `Invalid rule type. Expected ${expected}, got ${actual}.`;
    static readonly missingValuesInRule = (ruleType: string, ...missingValues: string[]) => `${ruleType} rule is missing the following values: ${missingValues.join(', ')}.`;
    static readonly reportBug = (baseMessage: string) => ErrorMessages.appendAdditionalInfoIfPresent(baseMessage, `This is a bug. Please report it on GitHub using the following link: https://github.com/VueTubeApp/VueTube-Extractor/issues/new?assignees=&labels=bug&template=bug-report.yml}.`)
    static readonly missingRequired = (requiredType: string, requiredName: string, functionName?: string) => ErrorMessages.appendAdditionalInfoIfPresent(`${requiredType} ${requiredName} is required but is missing`, functionName ? ` when calling ${functionName}` : "", ".")
    static readonly notImplemented = (functionName: string) => `Function ${functionName} is not implemented. Please avoid using this function until it is implemented.`;
    static appendAdditionalInfoIfPresent(message: string, ...additionalInfo: string[]): string {
        if (additionalInfo.length > 0) {
            return message + " " + additionalInfo.join(" ");
        }
        return message;
    }
}

export default {VueTubeExtractorError, ExtractorNotReadyError};
