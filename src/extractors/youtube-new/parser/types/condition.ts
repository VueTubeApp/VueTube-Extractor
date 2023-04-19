import { ObjectRule, ConditionalFn, Rule } from "./common";
import { ObjectRuleProps } from "./props";

type ConditionalKeysSet<Rule extends ObjectRule> = keyof {
  [Key in keyof ObjectRuleProps<Rule> as ObjectRuleProps<Rule>[Key] extends { expected: unknown } ? Key : never]: unknown;
}

type HasConditionalKeysSet<Rule extends ObjectRule, First, Second> = 
  ConditionalKeysSet<Rule> extends never ?
  Second :
  First;

export type AppliedCondition<Rule extends ObjectRule, Type> = 
  Rule extends { condition: ConditionalFn } ? 
  Type | null :
  HasConditionalKeysSet<
    Rule, 
    Type | null, 
    Type
  >;
