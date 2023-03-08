//imports here
import { objectRule, Rule } from '../parser/types';
import { utilityErrors, ErrorMessages } from '@utils';
import { CONTINUATIONS } from './continuations.const';
//Put all imports into this array

const rulesImport: Rule[] = [CONTINUATIONS];

export default class RuleFactory {
  private rules: { [key: string]: Rule };

  /**
   * Create a new rule factory
   * @param importDefault If true, the default rules will be imported. Only recommended for testing.
   */
  constructor(importDefault = true) {
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
    // check if the rule should be added
    if (rule.isDiscoverable === false) return;
    // find the name of the rule
    const name: string = rule.name;
    const names = [name, ...(rule.aliases || [])];
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
   * Retrieves a rule if it exists.
   * @param name The name of the rule to get
   * @returns The rule with the given name
   */
  getRule(name: string) {
    return this.rules[name];
  }

  /**
   * Loops through a given object and adds valid sub-rules to a given rule.
   * @param rule The rule to add sub-rules to
   * @param response The object to loop through
   */
  getSubRules(rule: objectRule, response: { [key: string]: any }) {
    const result = rule;
    for (const key in response) {
      const subRule = this.getRule(key);
      if (!(subRule && !rule.properties[key])) continue;
      result.properties[key] = subRule;
    }
    return result;
  }
}
