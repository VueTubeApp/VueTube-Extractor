import type { ObjectRule, ObjectPropertyRule } from "./common"
import type { ObjectRuleProps } from "./props";
import type { UnionToIntersection } from "./utils";

type IsFlaten<Rule extends ObjectRule, First, Second> = 
  Rule extends { flatten: true } ?
  First :
  Second
;

type MakeRequiredFalse<Rule extends ObjectPropertyRule, Key extends keyof ObjectRuleProps<Rule>> = 
  Rule extends { required: false } ? 
  Omit<ObjectRuleProps<Rule>[Key], 'required'> & { required: false } :
  ObjectRuleProps<Rule>[Key]

type FlattenProp<PropName extends string | number, Rule extends ObjectPropertyRule> = {
  [
    Key in Exclude<keyof ObjectRuleProps<Rule>, symbol> as 
    `${PropName}-${Key}`
  ]: MakeRequiredFalse<Rule, Key>;
}

type ExcludeNonObjectRuleProps<Rule extends ObjectRule> = keyof {
  [
    Key in keyof ObjectRuleProps<Rule> as 
    ObjectRuleProps<Rule>[Key] extends ObjectPropertyRule ? 
    Key : 
    never
  ]: unknown;
}

type FlattenObjectRule<Rule extends ObjectRule> = Omit<Rule, 'properties'> & {
  properties: {
    [
      Key in keyof ObjectRuleProps<Rule> as 
      ObjectRuleProps<Rule>[Key] extends ObjectPropertyRule ? 
      never : 
      Key
    ]: ObjectRuleProps<Rule>[Key]
  } & UnionToIntersection<
    {
      [
        Key in Exclude<ExcludeNonObjectRuleProps<Rule>, symbol>
      ]: ObjectRuleProps<Rule>[Key] extends ObjectPropertyRule ? 
      FlattenProp<Key, ObjectRuleProps<Rule>[Key]> :
      never;
    }[Exclude<ExcludeNonObjectRuleProps<Rule>, symbol>]
  >;
}

export type AppliedFlattenObjectRule<Rule> =
  Rule extends ObjectRule ?
  IsFlaten<
    Rule, 
    FlattenObjectRule<Rule>,
    Rule
  > : 
  never;
