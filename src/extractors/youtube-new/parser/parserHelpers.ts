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
            if (Array.isArray(toCheck) && typeGuard == 'array') {
                return true;
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
        for (const KEY of Object.keys(this.rule.properties)) {
            this.rule.properties[KEY].required ??= true;
        }
        return this.rule;
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