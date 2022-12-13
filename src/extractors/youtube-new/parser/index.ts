import {Rule, objectRule, arrayRule} from './types';
import {utilityErrors} from "../../../utils";

/*
* Applies a rule to a given object
* @param {Object} toParse - The object to apply the rule to
* @param {Rule} rule - The rule to apply
* @returns {Object} The parsed object
*/
export function applyObjectRule(toParse: { [key: string]: any }, rule: Rule): object {
    if (rule.type !== 'object') {
        throw new utilityErrors.VueTubeExtractorError('Invalid rule type when calling applyObjectRule. This is bug. Please report it on the GitHub repository here: https://github.com/VueTubeApp/VueTube-Extractor');
    }
    if (!rule.properties) {
        throw new utilityErrors.VueTubeExtractorError('Invalid rule when calling applyObjectRule. Have you forgotten to add the properties key?');
    }
    if (typeof toParse !== 'object' || Array.isArray(toParse)) {
        throw new utilityErrors.VueTubeExtractorError('Invalid object when calling applyObjectRule. The input must be an object with a key-value pair.');
    }
    const Helper = new ObjectRuleHelper(rule);
    rule = Helper.fillRule() as objectRule;
    const PROCESSED_OBJECT: { [key: string]: any } = {};
    // Loops through all the properties in the rule and applies them to the object
    for (const [key, value] of Object.entries(rule.properties)) {
        // Check if key is in the object, if not, check if it is required and throw an error if it is
        if (!(key in toParse)) {
            if (value.required) {
                throw new utilityErrors.VueTubeExtractorError(`Missing required key ${key} when calling applyObjectRule.`);
            }
            continue;
        }
        if (value.type == "rule") {
            if (!value.rule) {
                throw new utilityErrors.VueTubeExtractorError('Invalid rule when calling applyObjectRule. Have you forgotten to add the rule key?');
            }
            PROCESSED_OBJECT[key] = applyObjectRule(toParse[key], value.rule);
        } else {
            if (!Helper.checkTypeGuard(toParse[key], value.type)) {
                if (value.required && rule.strict) {
                    throw new TypeError(`Invalid type for key ${key} when calling applyObjectRule. Expected ${value.type} but got ${typeof toParse[key]}`);
                }
                continue;
            }
            PROCESSED_OBJECT[Helper.followKeymap(key)] = toParse[key];
        }
    }
    return PROCESSED_OBJECT;

}

/*
* A helper class for parsers. Abstract class, do not instantiate.
* @constructor
* @abstract
 */
abstract class ParserHelper {

    protected rule: Rule;

    protected constructor(rule: Rule) {
        this.rule = rule;
    }

    /*
    *
     */

    /*
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
            throw new utilityErrors.VueTubeExtractorError('Invalid type guard when calling checkTypeGuard. Please check the type guard you are using.');
        }
    }

    /*
    * Fill a rule with default values
    * @abstract
    * @returns {Rule} The filled rule
     */
    public abstract fillRule(): Rule;
}

/*
* A helper class for object rules. Array rules should refer to `ArrayRuleHelper` instead
* @constructor
* @augments parserHelper
 */
export class ObjectRuleHelper extends ParserHelper {

    protected rule: objectRule;

    constructor(rule: objectRule) {
        super(rule);
    }

    /*
    * Follows a keymap and returns the value of the key
    * @param {string} key - The key to convert
    * @param {Object} keymap - The keymap to follow
    * @returns {string} The converted key
    */
    public followKeymap(key: string): string {
        if (this.rule.keymap && key in this.rule.keymap) {
            return this.rule.keymap[key];
        }
        return key;
    }


    /*
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

/*
* A helper class for array rules. Object rules should refer to `ObjectRuleHelper` instead
* @constructor
* @augments parserHelper
 */
export class ArrayRuleHelper extends ParserHelper {

    protected rule: arrayRule;

    constructor(rule: arrayRule) {
        super(rule);
    }

    /*
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