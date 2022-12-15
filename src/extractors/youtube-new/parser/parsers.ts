import {conditionalFunction, conditionalRule, objectRule, propertyRule, Rule} from "./types";
import {ErrorMessages, utilityErrors} from "@utils";
import {ObjectRuleHelper} from "./parserHelpers";
export {ObjectRuleHelper, ArrayRuleHelper} from "./parserHelpers";

/**
 * Class to parse object rules
 * @param {object} toParse - The object to parse according to the given rule
 * @param {objectRule} rule - The rule to parse the object with
 */
export class ObjectRuleParser {
    private readonly TO_PARSE: { [key: string]: any };
    private KEYMAP: { [key: string]: string };
    private readonly isStrict: boolean;
    private readonly condition: conditionalFunction | { [key: string]: conditionalRule };
    private readonly RULE_NAME: string;
    private readonly RULE_TYPE: string;
    private PROPERTIES: { [key: string]: propertyRule };
    private readonly PROCESSED_OBJECT: { [key: string]: any };
    private Helper: ObjectRuleHelper

    constructor(toParse: { [key: string]: any }, rule: objectRule) {
        this.TO_PARSE = toParse;
        this.RULE_TYPE = rule.type;
        this.RULE_NAME = rule.name || '';
        this.PROPERTIES = rule.properties;
        this.guardClauses();
        this.Helper = new ObjectRuleHelper(rule);
        const filledRule = this.Helper.fillRule();
        this.KEYMAP = filledRule.keymap as { [key: string]: string };
        this.isStrict = filledRule.strict as boolean;
        this.condition = filledRule.condition as conditionalFunction | { [key: string]: conditionalRule };
        this.PROPERTIES = filledRule.properties;
        this.PROCESSED_OBJECT = {};
    }

    /**
     * Method to parse a basic property. Simply returns the value of the given key in TO_PARSE
     * @param {string} key - The key to parse
     * @param {propertyRule} rule - The rule to parse the key with
     * @param {boolean} isStrictlyRequired - Whether the key is required and the rule is strict
     * @returns {any | undefined} - The value of the key in TO_PARSE. If the key is not present and the rule is strict, returns undefined
     */
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

    /**
     * Method to parse a property that is a rule. Essentially, it recursively calls applyObjectRule on the value of the key in TO_PARSE
     * @param {string} key - The key to parse
     * @param {propertyRule} rule - The rule to parse the key with
     * @param {boolean} isStrictlyRequired - Whether the key is required and the rule is strict
     * @returns {any | undefined} - The parsed result. If the key is not present and the rule is strict, returns undefined
     */
    private parseRecursiveProperty(key: string, rule: propertyRule, isStrictlyRequired: boolean): any | undefined {
        if (!rule.rule) {
            throw new utilityErrors.VueTubeExtractorError(ErrorMessages.missingValuesInRule(key, 'rule'));
        }
        let SUB_RULE_RESULT
        try {
            const SubRuleParser = new ObjectRuleParser(this.TO_PARSE[key], rule.rule as objectRule); //TODO: use general rule parser when implemented
            SUB_RULE_RESULT = SubRuleParser.parse(); //Something like this. Placeholder for now
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

    /**
     * Identifies the type of rule and calls the appropriate method to parse the property
     * @param {string} key - The key to parse
     * @param {propertyRule} rule - The rule to parse the key with
     * @returns {any | undefined} - The parsed result. If the key is not present and the rule is strict, returns undefined
     */
    private parseProperty(key: string, rule: propertyRule): any | undefined {
        const isStrictlyRequired = rule.required as boolean && this.isStrict && !rule.default;
        if (rule.type === 'group') {
            // TODO: Implement groups
            throw new utilityErrors.VueTubeExtractorError(ErrorMessages.notImplemented('parseGroups'));
        } else if (rule.type == 'rule') {
            return this.parseRecursiveProperty(key, rule, isStrictlyRequired);
        }
        return this.parseBasicProperty(key, rule, isStrictlyRequired);
    }

    /**
     * A series of checks to determine if the given rule is valid and can be parsed. Throws an error if the rule is invalid
     * @returns {void}
     */
    private guardClauses(): void {
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

    /**
     * Public method to parse the object. Returns the parsed object
     * @returns {any | undefined} - The parsed object. If for whatever reason the result is an empty object, returns undefined
     */
    public parse(): any | undefined {
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

/**
 * Function that selects the appropriate parser for the given rule type
 * @param {any} toParse - The object to parse
 * @param {Rule} rule - The rule to parse the object with
 * @returns {any | undefined} - The parsed object. If for whatever reason the result is an empty object, returns undefined
 */
export function parseRule(toParse: any, rule: Rule): any | undefined {
    if (rule.type === 'object') {
        const Parser = new ObjectRuleParser(toParse, rule);
        return Parser.parse();
    } else if (rule.type === 'array') {
        throw new utilityErrors.VueTubeExtractorError(ErrorMessages.notImplemented('parseGroups'));
    } else {
        throw new utilityErrors.VueTubeExtractorError(ErrorMessages.invalidRuleType('object or group', (rule as Rule).type || 'undefined'));
    }
}