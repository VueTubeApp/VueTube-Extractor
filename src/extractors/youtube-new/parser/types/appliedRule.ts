import type { PropertyRule, ObjectRule, ArrayRule, TypeMap, Rule } from "./common";
import type { RuleKeyRemap } from "./remap";
import type { RuleStrictMode } from "./strict";
import type { RequiredProps, NotRequiredProps } from "./required";


export type IndexType<Type extends PropertyRule> = 
  Type['type'] extends keyof TypeMap ? 
  TypeMap[Type['type']] :
  Type extends ObjectRule ?
  AppliedObjectRule<Type> :
  Type extends ArrayRule ? 
  AppliedArrayRule<Type> :
  never;

export type AppliedObjectRule<Rule extends ObjectRule> = RuleKeyRemap<
  Rule, 
  RuleStrictMode<
    Rule, 
    RequiredProps<Rule> & NotRequiredProps<Rule>
  >
>;

export type AppliedArrayRule<Rule extends ArrayRule> = Array<AppliedRule<Rule['items']>>;

export type AppliedRule<RuleType extends Rule> = 
  RuleType extends ObjectRule ? 
  AppliedObjectRule<RuleType> :
  RuleType extends ArrayRule ?
  AppliedArrayRule<RuleType> : 
  never;
