import type { ObjectRule, PropertyRule, ObjectRuleProps } from "./common";
import type { UnionToIntersection, PickNever } from "./utils";

type PropAliases<Prop extends PropertyRule> = Prop['aliases'];

type AliasesUnion<Prop extends PropertyRule> = 
  PropAliases<Prop> extends readonly string[] ?
  {
    [Key in keyof PropAliases<Prop>]: PropAliases<Prop>[Key]
  }[number] :
  never;

type ApplyAliasToProp<Prop extends PropertyRule> = {
  [Key in AliasesUnion<Prop>]: Prop
};

type AppliedRuleAliasesWithNever<Rule extends ObjectRule> = Omit<Rule, 'properties'> & {
  properties: ObjectRuleProps<Rule> & UnionToIntersection<{
    [Key in keyof ObjectRuleProps<Rule>]: ApplyAliasToProp<ObjectRuleProps<Rule>[Key]>;
  }[keyof ObjectRuleProps<Rule>]>
};

export type AppliedRuleAliases<Rule> =
  Rule extends ObjectRule ?
  (
    keyof PickNever<ObjectRuleProps<AppliedRuleAliasesWithNever<Rule>>> extends never ?
    AppliedRuleAliasesWithNever<Rule> :
    never
  ) :
  never;
