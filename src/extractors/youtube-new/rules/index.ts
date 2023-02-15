//imports here
import {Rule} from "../parser/types";
import {utilityErrors, ErrorMessages} from "@utils";

//Put all imports into this array

class ruleFactory {
    private rules: { [key: string]: Rule };

    constructor() {
        this.rules = {};

    }

    //Create a new rule
    createRule(rule: Rule) {
        // find the name of the rule
        const name: string = rule.name;
        this.rules[name] = rule;
        const names = [name, ...rule.aliases || []];
        names.forEach(alias => {
            this.namespaceCheck(alias);
            this.rules[alias] = rule;
        });
    }

    // Handle namespace collisions and throw an error if there is a collision
    private namespaceCheck(name: string) {
        if (this.rules[name]) {
            throw new utilityErrors.VueTubeExtractorError(ErrorMessages.nameConflict(name));
        }
    }

    //Get a rule
    getRule(name: string) {
        return this.rules[name];
    }
}