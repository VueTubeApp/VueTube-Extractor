import type { ObjectRule, PropertyRule } from "./common";
import type { ObjectRuleProps } from "./props";
import type { ObjectRuleKeys } from "./keys";
import type { IndexType } from "./appliedRule";
import type { PropDefaultSet } from "./default";
import type { RuleStrictMode } from "./strict";
import type { PropRequired } from "./required";

type PropNonNullable<Rule extends ObjectRule, Prop extends PropertyRule, KeyType> = PropDefaultSet<
  Prop, 
  KeyType, 
  RuleStrictMode<
    Rule,
    PropRequired<
      Prop,
      KeyType,
      never
    >,
    never
  >
>;

type PropNullable<Rule extends ObjectRule, Prop extends PropertyRule, KeyType> = PropDefaultSet<
  Prop, 
  never, 
  RuleStrictMode<
    Rule,
    PropRequired<
      Prop,
      never,
      KeyType
    >,
    KeyType
  >
>;

type NonNullableProps<Rule extends ObjectRule> = {
  [Key in ObjectRuleKeys<Rule> as PropNonNullable<Rule, ObjectRuleProps<Rule>[Key], Key>]: IndexType<Rule['properties'][Key]>;
};

type NullableProps<Rule extends ObjectRule> = {
  [Key in ObjectRuleKeys<Rule> as PropNullable<Rule, ObjectRuleProps<Rule>[Key], Key>]?: IndexType<Rule['properties'][Key]>;
};

export type ObjectProps<Rule> = 
  Rule extends ObjectRule ?
  NonNullableProps<Rule> & NullableProps<Rule> :
  never
;