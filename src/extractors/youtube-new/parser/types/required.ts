import type { PropertyRule, ObjectRule } from "./common";
import type { ObjectRuleProps } from "./props";
import type { ObjectRuleKeys } from "./keys";
import type { IndexType } from "./appliedRule";
import type { PropDefaultSet, PropDefaultNone } from "./default";

type PropRequired<Prop extends PropertyRule, KeyType> = 
  Prop extends { required: false } ? 
  PropDefaultSet<Prop, KeyType> : 
  KeyType;

type PropNotRequired<Prop extends PropertyRule, KeyType> = 
  Prop extends { required: false } ? 
  PropDefaultNone<Prop, KeyType> : 
  never;

export type RequiredProps<Rule extends ObjectRule> = {
  [Key in ObjectRuleKeys<Rule> as PropRequired<ObjectRuleProps<Rule>[Key], Key>]: IndexType<Rule['properties'][Key]>;
};

export type NotRequiredProps<Rule extends ObjectRule> = {
  [Key in ObjectRuleKeys<Rule> as PropNotRequired<ObjectRuleProps<Rule>[Key], Key>]?: IndexType<Rule['properties'][Key]>;
};
