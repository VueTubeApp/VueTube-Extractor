import type { ObjectRule, PropertyRule } from "./common";
import type { UnionToIntersection, PickNever } from "./utils";

type AliasesUnion<Prop extends PropertyRule> = 
  Prop['aliases'] extends readonly string[] ?
  {
    [Key in keyof Prop['aliases']]: Prop['aliases'][Key]
  }[number] :
  never;

type ApplyAliasToProp<Prop extends PropertyRule> = {
  [Key in AliasesUnion<Prop>]: Prop
};

type AppliedRuleAliasesWithNever<Rule extends ObjectRule> = Omit<Rule, 'properties'> & {
  properties: Rule['properties'] & UnionToIntersection<{
    [Key in keyof Rule['properties']]: ApplyAliasToProp<Rule['properties'][Key]>;
  }[keyof Rule['properties']]>
};

export type AppliedRuleAliases<Rule extends ObjectRule> = 
  keyof PickNever<AppliedRuleAliasesWithNever<Rule>['properties']> extends never ?
  AppliedRuleAliasesWithNever<Rule> :
  never;
