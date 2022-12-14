import type {
    Rule,
    objectRule,
    arrayRule,
    conditionalRule,
    conditionalFunction,
    groupedRules,
    propertyRule
} from './types';
import {utilityErrors, ErrorMessages} from "../../../utils";

/*
* Applies a rule to a given object
* @param {Object} toParse - The object to apply the rule to
* @param {Rule} rule - The rule to apply
* @returns {Object} The parsed object
*/
export class ObjectRuleParser {
    private TO_PARSE: { [key: string]: any };
    private KEYMAP: { [key: string]: string };
    private readonly isStrict: boolean;
    private condition: conditionalFunction | { [key: string]: conditionalRule };
    private RULE_NAME: string;
    private RULE_TYPE: string;
    private readonly PROPERTIES: { [key: string]: propertyRule };
    private PROCESSED_OBJECT: { [key: string]: any };
    private Helper: ObjectRuleHelper

    constructor(toParse: { [key: string]: any }, rule: objectRule) {
        this.TO_PARSE = toParse;
        this.Helper = new ObjectRuleHelper(rule);
        const filledRule = this.Helper.fillRule();
        this.RULE_TYPE = filledRule.type;
        this.KEYMAP = filledRule.keymap as { [key: string]: string };
        this.isStrict = filledRule.strict as boolean;
        this.condition = filledRule.condition as conditionalFunction | { [key: string]: conditionalRule };
        this.RULE_NAME = filledRule.name || '';
        this.PROPERTIES = filledRule.properties;
        this.PROCESSED_OBJECT = {};
    }

    private parseBasicProperty(key: string, rule: propertyRule, isStrictlyRequired: boolean): any | undefined {
        if (!(key in this.TO_PARSE)) {
            const errorMessage = ErrorMessages.missingRequired("key", key, "applyObjectRule");
            return this.Helper.checkStrictlyRequired(isStrictlyRequired, new utilityErrors.VueTubeExtractorError(errorMessage), rule.default);
        }
        if (!this.Helper.checkTypeGuard(this.TO_PARSE[key], rule.type)) {
            const errorMessage = ErrorMessages.typeGuardMismatch(rule.type, typeof this.TO_PARSE[key], key)
            return this.Helper.checkStrictlyRequired(isStrictlyRequired, new TypeError(errorMessage), rule.default);
        }
        return this.TO_PARSE[key];
    }

    private parseRecursiveProperty(key: string, rule: propertyRule, isStrictlyRequired: boolean): any | undefined {
        if (!rule.rule) {
            throw new utilityErrors.VueTubeExtractorError(ErrorMessages.missingValuesInRule(key, 'rule'));
        }
        let SUB_RULE_RESULT
        try {
            const SubRuleParser = new ObjectRuleParser(this.TO_PARSE, rule.rule as objectRule); //TODO: use general rule parser when implemented
            SUB_RULE_RESULT = SubRuleParser.parseProperty(this.TO_PARSE[key], rule.rule); //Something like this. Placeholder for now
        } catch (error) {
            // TODO: Catch errors from sub-rules and add additional information from the parent rule
            // For now, just rethrow the error and note that it was from a sub-rule
            let message = `error from sub-rule ${key}`;
            if (error instanceof Error) message += `: ${error.message}`;
            throw new utilityErrors.VueTubeExtractorError(ErrorMessages.reportBug(message));
        }
        const errorMessage = ErrorMessages.missingRequired("key", key, "applyObjectRule");
        SUB_RULE_RESULT ??= this.Helper.checkStrictlyRequired(isStrictlyRequired, new utilityErrors.VueTubeExtractorError(errorMessage), rule.default);
        return SUB_RULE_RESULT
    }

    private parseProperty(key: string, rule: propertyRule): any {
        const isStrictlyRequired = rule.required as boolean && this.isStrict && !rule.default;
        if (this.RULE_TYPE === 'group') {
            // TODO: Implement groups
        } else if (this.RULE_TYPE == "rule") {
            return this.parseRecursiveProperty(key, rule, isStrictlyRequired);
        }
        return this.parseBasicProperty(key, rule, isStrictlyRequired);
    }

    private guardClauses() {
        const errorMessage: string[] = [];
        if (this.RULE_TYPE !== 'object') {
            errorMessage.push(ErrorMessages.invalidRuleType('object', this.RULE_TYPE))
        }
        if (!this.PROPERTIES) {
            errorMessage.push(ErrorMessages.missingValuesInRule(this.RULE_NAME || 'object', 'properties'))
        }
        if (typeof this.TO_PARSE !== 'object' || Array.isArray(this.TO_PARSE)) {
            errorMessage.push(ErrorMessages.reportBug(ErrorMessages.ruleTypeMismatch('object', Array.isArray(this.TO_PARSE) ? "array" : typeof this.TO_PARSE)))
        }
        if (errorMessage.length > 0) {
            throw new utilityErrors.VueTubeExtractorError(ErrorMessages.reportBug(errorMessage.join('\n')));
        }
    }

    public parse(): any {
        this.guardClauses();
        if (this.condition && !this.Helper.evaluateCondition(this.TO_PARSE, this.condition)) {
            return undefined;
        }
        for (const [key, value] of Object.entries(this.PROPERTIES)) {
            const parsedProperty = this.parseProperty(key, value);
            if (parsedProperty) this.PROCESSED_OBJECT[this.Helper.followKeymap(key)] = parsedProperty;
        }
        return Object.keys(this.PROCESSED_OBJECT).length > 0 ? this.PROCESSED_OBJECT : undefined;
    }
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

    /*
    * Evaluates a given condition
    * @param {any} toCheck - The object to check
    * @param {((item: any) => boolean | { [key: string]: conditionalRule }} condition - The condition to check against
    * @returns {boolean} Whether the condition is true
     */
    public evaluateCondition(toCheck: any, condition: conditionalFunction | { [key: string]: conditionalRule }): boolean {
        if (typeof condition == 'function') {
            return condition(toCheck);
        } else {
            return false // TODO: Implement conditional rules
        }
    }

    /*
    * Function to check if a rule is strictly required. If true throws a given error, if false returns the default value
    * @param {boolean} isStrictlyRequired - Whether the rule is strictly required
    * @param {Error} error - The error to throw if the rule is strictly required
    * @param {T} defaultValue - The default value to return if the rule is not strictly required
    * @returns {T} The default value if the rule is not strictly required, otherwise throws an error
     */
    public checkStrictlyRequired<T>(isStrictlyRequired: boolean, error: Error, defaultValue: T): T {
        if (isStrictlyRequired) {
            throw error;
        } else {
            return defaultValue;
        }
    }
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
        for (const KEY in this.rule.properties) {
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