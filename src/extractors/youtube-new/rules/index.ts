//imports here
import { Rule } from "../parser/types";
import { utilityErrors, ErrorMessages } from "@utils";
import { default as continuations } from "./continuations";
//Put all imports into this array

const rulesImport: Rule[] = [
    continuations,
];

export default class ruleFactory {
    private rules: { [key: string]: Rule };

    /**
     * Create a new rule factory
     * @param importDefault If true, the default rules will be imported. Only recommended for testing.
     */
    constructor(importDefault: boolean = true) {
        this.rules = {};
        if (importDefault) rulesImport.forEach(rule => this.createRule(rule));
    }

    /**
     * Add a new rule to the factory. If the rule has aliases, they will be added as well.
     * 
     * Not recommended for usage outside of testing unless you know what you are doing.
     * @param rule The rule to add
     */
    createRule(rule: Rule) {
        // find the name of the rule
        const name: string = rule.name;
        const names = [name, ...rule.aliases || []];
        names.forEach(alias => {
            this.namespaceCheck(alias);
            this.rules[alias] = rule;
        });
    }

    /**
     * Detects if a name is already in use. If it is, an error will be thrown.
     * @param name The name to check
     */
    private namespaceCheck(name: string) {
        if (this.rules[name]) {
            throw new utilityErrors.VueTubeExtractorError(ErrorMessages.nameConflict(name));
        }
    }

    /**
     * Retrieves a rule from the factory if it exists.
     * @param name The name of the rule to get
     * @returns The rule with the given name
     */
    getRule(name: string) {
        return this.rules[name];
    }
}