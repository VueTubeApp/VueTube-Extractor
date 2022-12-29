import {arrayRule, conditionalFunction, conditionalRule, objectRule, Rule} from "./types";
import {ErrorMessages, utilityErrors} from "@utils";

/**
 * A helper class for parsers. Abstract class, do not instantiate.
 * @abstract
 * @param {rule} rule - The rule to parse
 */
abstract class ParserHelper {

    protected rule: Rule;

    protected constructor(rule: Rule) {
        this.rule = rule;
    }

    /**
     * Checks if a given value matches a type guard
     * @param {any} toCheck - The object to check
     * @param {string} typeGuard - The type guard to check against
     * @returns {boolean} Whether the object matches the type guard
     */
    public checkTypeGuard(toCheck: any, typeGuard: string): boolean {
        // Check if type guard is a supported typeof type
        if (typeGuard == "any") {
            return true;
        }
        if (['string', 'number', 'boolean', 'object', 'array'].includes(typeGuard)) {
            if (Array.isArray(toCheck)) {
                return typeGuard == 'array';
            } else {
                return typeof toCheck == typeGuard;
            }
        } else {
            const errorMessage = ErrorMessages.invalidTypeGuard(typeGuard);
            throw new utilityErrors.VueTubeExtractorError(errorMessage);
        }
    }

    /**
     * Fill a rule with default values
     * @abstract
     * @returns {Rule} The filled rule
     */
    public abstract fillRule(): Rule;

    /**
     * Evaluates a given condition
     * @param {any} toCheck - The object to check
     * @param {conditionalFunction | { [key: string]: conditionalRule }} condition - The condition to check against
     * @returns {boolean} Whether the condition is true
     */
    public evaluateCondition(toCheck: any, condition: conditionalFunction | { [key: string]: conditionalRule }): boolean {
        if (typeof condition == 'function') {
            return condition(toCheck);
        } else {
            return false // TODO: Implement conditional rules
        }
    }

    /**
     * Function to check if a rule is strictly required. If true throws a given error, if false returns the default value
     * @param {boolean} isStrictlyRequired - Whether the rule is strictly required
     * @param {Error} error - The error to throw if the rule is strictly required
     * @param {any} defaultValue - The default value to return if the rule is not strictly required
     * @returns {any} The default value if the rule is not strictly required, otherwise throws an error
     */
    public checkStrictlyRequired(isStrictlyRequired: boolean, error: Error, defaultValue: any): any {
        if (isStrictlyRequired) {
            throw error;
        } else {
            return defaultValue;
        }
    }

    /**
     * Returns a function wrapped in a try-catch block. Used for sub-rules
     * @returns The result of the function
     * @param {function} runCode - The function to run
     * @param {string} key - The key to use for the error message.
     * @param thisArg - Pass the context to the function
     * @param args - The arguments to pass to the function
     */
    public wrapFunction<T extends any[], R>(runCode: (...args: T) => R, key: string, thisArg: any, ...args: T): R | undefined {
        try {
            return runCode.bind(thisArg)(...args);
        } catch (error) {
            let message = `error from sub-rule`;
            message = ErrorMessages.appendAdditionalInfoIfPresent(message, key);
            if (error instanceof Error) message += `: ${error.message}`;
            throw new utilityErrors.VueTubeExtractorError(message);
        }
    }
}


/**
 * A helper class for object rules. Array rules should refer to `ArrayRuleHelper` instead
 * @augments ParserHelper
 * @param {objectRule} rule - The rule to parse
 */
export class ObjectRuleHelper extends ParserHelper {

    protected rule: objectRule;

    constructor(rule: objectRule) {
        super(rule);
    }

    /**
     * Follows a keymap and returns the value of the key
     * @param {string} key - The key to convert
     * @returns {string} The converted key
     */
    public followKeymap(key: string): string {
        if (this.rule.keymap && key in this.rule.keymap) {
            return this.rule.keymap[key];
        }
        return key;
    }


    /**
     * Fills a rule with default values if they are not present
     * @returns {objectRule} The filled rule
     */
    public fillRule(): objectRule {
        this.rule.keymap ??= {};
        this.rule.strict ??= true;
        this.rule.condition ??= () => true;
        this.rule.flatten ??= false;
        for (const KEY of Object.keys(this.rule.properties)) {
            this.rule.properties[KEY].required ??= true;
        }
        return this.rule;
    }

    /**
     * Flattens & converts a given object via keymap
     * @param {[key: string]: any} obj - The object to convert
     * @returns {[key: string]: any} The converted object
     */
    public flattenConvertObject(obj: { [key: string]: any }): { [key: string]: any } {
        const flattened = this.flattenObject(obj);
        const converted: { [key: string]: any } = {};
        for (const key of Object.keys(flattened)) {
            converted[this.followKeymap(key)] = flattened[key];
        }
        return converted;
    }

    /**
     * Flattens a given object
     * @param obj - The object to flatten
     * @param path - Optional. The path to the object. For naming conflicts
     */
    private flattenObject(obj: { [key: string]: any }, path = ''): { [key: string]: any } {
        const result: { [key: string]: any } = {};
        for (const key of Object.keys(obj)) {
            const value = obj[key];
            const newPath = path ? `${path}-${key}` : key;
            if (typeof value === 'object' && value !== null) {
                Object.assign(result, this.flattenObject(value, newPath));
            } else {
                result[newPath] = value;
            }
        }
        return result;
    }

    /**
     * JSONPath to object. Returns undefined if the path does not exist
     * @param {string} path - The path to the object
     * @param {any} obj - The object to search
     * @returns {any|undefined} The object at the given path
     */
    public jsonPathToObject(path: string, obj: any): any | undefined {
        const pathArray = path.split('.');
        let current = obj;
        for (const key of pathArray) {
            if (current === undefined) {
                return undefined;
            } else if (key.includes('[')) {
                const index = parseInt(key.split('[')[1].split(']')[0]);
                current = current[key.split('[')[0]][index];
            } else {
                current = current[key];
            }
        }
        return current;
    }
}

/**
 * A helper class for array rules. Object rules should refer to `ObjectRuleHelper` instead
 * @constructor
 * @augments ParserHelper
 * @param {arrayRule} rule - The rule to parse
 */
export class ArrayRuleHelper extends ParserHelper {

    protected rule: arrayRule;

    constructor(rule: arrayRule) {
        super(rule);
    }

    /**
     * Fills a rule with default values if they are not present
     * @returns {arrayRule} The filled rule
     */
    public fillRule(): arrayRule {
        const DEFAULTED_RULE: Rule = this.rule;
        DEFAULTED_RULE.strict ??= true;
        DEFAULTED_RULE.condition ??= () => true;
        DEFAULTED_RULE.limit ??= 0;
        return DEFAULTED_RULE;
    }
}