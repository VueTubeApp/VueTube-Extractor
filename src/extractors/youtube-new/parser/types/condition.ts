import type { ObjectRule, ConditionalFn, ObjectRuleProps } from "./common";

type ConditionalKeysSet<Rule extends ObjectRule> = keyof {
  [Key in keyof ObjectRuleProps<Rule> as ObjectRuleProps<Rule>[Key] extends { expected: unknown } ? Key : never]: unknown;
}

type HasConditionalKeysSet<Rule extends ObjectRule, First, Second> = 
  ConditionalKeysSet<Rule> extends never ?
  Second :
  First;

export type AppliedCondition<Rule, Type> = 
  Rule extends ObjectRule ?
  (
    Rule extends { condition: ConditionalFn } ? 
    Type | undefined :
    HasConditionalKeysSet<
      Rule, 
      Type | undefined, 
      Type
    > 
  ):
  never;
