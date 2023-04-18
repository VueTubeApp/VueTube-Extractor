import type { ObjectRule, TypeMap } from "./common";

export type ObjectRuleProps<Rule extends ObjectRule> = Rule['properties'];

export type PrimitiveRuleProps<Rule extends ObjectRule> = {
  [Key in keyof ObjectRuleProps<Rule> as ObjectRuleProps<Rule>[Key]['type'] extends keyof TypeMap ? Key : never]: ObjectRuleProps<Rule>[Key];
}
