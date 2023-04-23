import type { ObjectRule } from "./common";
import type { ObjectRuleProps } from "./props";

type RuleRemap<Rule extends ObjectRule> =
  Omit<Rule, 'properties'> & 
    {
      properties: {
      [ 
        Key in keyof ObjectRuleProps<Rule> as 
        Key extends keyof Rule['keymap'] ? 
        Rule['keymap'][Key] extends string ? 
        Rule['keymap'][Key] : 
        Key : 
        Key
      ]: ObjectRuleProps<Rule>[Key] extends ObjectRule ? // Remap done recursively for flat to work correctly
      RuleRemap<ObjectRuleProps<Rule>[Key]> :
      ObjectRuleProps<Rule>[Key];
    }
  }

export type RuleKeyRemap<Rule> = 
  Rule extends ObjectRule ?
  RuleRemap<Rule> :
  never;