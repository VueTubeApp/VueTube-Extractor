import { HttpOptions } from "@capacitor-community/http";
import httpMetadata from "../types/httpMetadata";

/**
 * Constructs an HTTP object with the correct headers and base data for YouTube.
 */

export default class YouTubeHTTPOptions {

    private baseOptions: HttpOptions;
    private metadata: httpMetadata;

    constructor(metadata: httpMetadata) {
        this.metadata = metadata;
        this.baseOptions = this.setBaseOptions();
    }

    /**
     * Returns a base HTTP options object with the correct headers and base data for YouTube. Should be called before any other methods.
     * @returns {HttpOptions}
     */
    private setBaseOptions(): HttpOptions {
        const base: HttpOptions = {
            url: "",
            headers: {},
            data: {},
            params: {},
            method: "GET",
        }
        base.headers ? ['accept-language'] || '' : `${this.metadata.context.client.gl}`;
        return base;
    }

    /**
     * Returns an HttpOptions object by merging the base options with the given options. 
     * Joining the base options with the given options is done by overwriting the base options 
     * except for sub arrays and objects, which is combined when possible.
     * 
     * @param {HttpOptions} options - the options to merge with the base options
     * 
     * @returns {HttpOptions}
     */
    public getOptions(options: HttpOptions): HttpOptions {
        const mergedOptions: HttpOptions = { ...this.baseOptions };
        for (const key in options) {
            if (Array.isArray(options[key as keyof HttpOptions])) {
                mergedOptions[key as keyof HttpOptions] = [...options[key as keyof HttpOptions]];
            } else if (typeof options[key as keyof HttpOptions] === "object") {
                mergedOptions[key as keyof HttpOptions] = { ...options[key as keyof HttpOptions] };
            } else {
                mergedOptions[key as keyof HttpOptions] = options[key as keyof HttpOptions];
            }

        }
        return mergedOptions;
    }
}