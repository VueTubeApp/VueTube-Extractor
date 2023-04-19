import type { PropertyRule, ObjectRule, ArrayRule, TypeMap, Rule } from "./common";
import type { RuleKeyRemap } from "./remap";
import type { ObjectProps } from "./objectProps";
import type { AppliedCondition } from "./condition";

export type IndexType<Prop extends PropertyRule> = 
  Prop['type'] extends keyof TypeMap ? 
  TypeMap[Prop['type']] :
  Prop extends ObjectRule ?
  AppliedObjectRule<Prop> :
  Prop extends ArrayRule ? 
  AppliedArrayRule<Prop> :
  never;

type AppliedObjectRuleWithoutCondition<Rule extends ObjectRule> = 
  ObjectProps<
    RuleKeyRemap<
      Rule
    >
  >;

export type AppliedObjectRule<Rule extends ObjectRule> = AppliedCondition<
  Rule,
  AppliedObjectRuleWithoutCondition<Rule>
>;

// If object condition is inside array rule, then have to remove object
// from the array, and it cant be nullable

export type AppliedArrayRule<Rule extends ArrayRule> = Array<
  Rule['items'] extends ObjectRule ?
  AppliedObjectRuleWithoutCondition<Rule['items']> :
  AppliedRule<Rule['items']>
>;

export type AppliedRule<RuleType extends Rule> = 
  RuleType extends ObjectRule ? 
  AppliedObjectRule<RuleType> :
  RuleType extends ArrayRule ?
  AppliedArrayRule<RuleType> : 
  never;
