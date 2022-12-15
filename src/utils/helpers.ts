import UserAgent from "user-agents";

/**
 * Main helper class, should be extended by other helpers but can be used on its own
 * If any method is only used by a single extractor, it should be moved to that extractor's util class to prevent clutter
 */
export default class UtilsBase {
    /**
     * Generates a random mobile UserAgent
     * @returns {UserAgent["data"]} a random mobile UserAgent
     */
    static randomMobileUserAgent(): UserAgent["data"] {
        return new UserAgent({ deviceCategory: 'mobile' }).data;
    }

    /**
     * Generates a random string with the given length
     *
     * @param {number} length - the length of the string
     *
     * @returns {string} a random string
     */
    static randomString(length: number): string {
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }
}

// /**
//  * Takes typescript mixins as an array and returns a class with the mixins applied
//  * @param {any} base - the base class to mixin to
//  * @param {Array<MixinFunc<MixinConstructor>>} mixins - an array of mixins
//  * @returns {any} a class with the mixins applied
//  */
// export function applyMixins(base: any, ...mixins: Array<MixinFunc>) {
//   mixins.forEach((mixin) => {
//     base = mixin(base);
//   });
//   return base;
// }