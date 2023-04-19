import type { ObjectRule } from "./common"
import type { ObjectRuleProps } from "./props"

export type RuleKeyRemap<Rule extends ObjectRule> = Omit<Rule, 'properties'> & 
  {
    properties: {
    [ 
      Key in keyof ObjectRuleProps<Rule> as 
      Key extends keyof Rule['keymap'] ? 
      Rule['keymap'][Key] extends string ? 
      Rule['keymap'][Key] : 
      Key : 
      Key
    ]: ObjectRuleProps<Rule>[Key];
  }
}