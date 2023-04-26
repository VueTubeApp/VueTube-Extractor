import type { ObjectRule, ConditionalFn, ObjectRuleProps, IndexTypeMap } from './common';

type ConditionalKeysSet<Rule extends ObjectRule> = keyof {
  [Key in keyof ObjectRuleProps<Rule> as ObjectRuleProps<Rule>[Key] extends { expected: IndexTypeMap<ObjectRuleProps<Rule>[Key]['type']> }
    ? Key
    : never]: unknown;
};

type HasConditionalKeysSet<Rule extends ObjectRule, First, Second> = ConditionalKeysSet<Rule> extends never ? Second : First;

export type HasCondition<Rule extends ObjectRule, First, Second> = Rule extends { condition: ConditionalFn }
  ? First
  : HasConditionalKeysSet<Rule, First, Second>;

export type AppliedCondition<Rule, Type> = Rule extends ObjectRule ? HasCondition<Rule, Type | undefined, Type> : never;
