import type { ObjectRule, PropertyRule } from "./common";
import type { ObjectRuleProps } from "./props";
import type { PickNever } from "./utils";

type ArraySeparator = '[0].';

type ObjectSeparator = '.';

type ExtractKey<Key extends string | number | symbol> = 
  Key extends `${infer Prefix}${ArraySeparator}${string | number}` ?
  Prefix :
  Key extends `${infer Prefix}${ObjectSeparator}${string | number}` ?
  Prefix :
  Key
  
type Extract<Key extends string | number | symbol, Prop extends PropertyRule> = 
  Key extends `${string | number}${ArraySeparator}${infer Postfix}` ? 
  { 
    type: 'array',
    items: {
      type: 'object';
      properties: {
        [Key in ExtractKey<Postfix>]: Extract<Postfix, Prop>
      }
    }
  } :
  Key extends `${string | number}${ObjectSeparator}${infer Postfix}` ?
  { 
    type: 'object',
    properties: {
      [Key in ExtractKey<Postfix>]: Extract<Postfix, Prop>
    }
  } :
  Prop
  ;

type JsonPathWithNever<Rule extends ObjectRule> = Omit<Rule, 'properties'> & {
  properties: {
    [Key in keyof ObjectRuleProps<Rule> as ExtractKey<Key> extends Key ? Key : never ]: ObjectRuleProps<Rule>[Key];
  } & {
    [Key in keyof ObjectRuleProps<Rule> as ExtractKey<Key> extends Key ? never : ExtractKey<Key>]: Extract<Key, ObjectRuleProps<Rule>[Key]>;
  }
}

export type AppliedJsonPath<Rule> = 
  Rule extends ObjectRule ?
  (
    keyof PickNever<JsonPathWithNever<Rule>['properties']> extends never ?
    JsonPathWithNever<Rule> :
    never
  ) :
  never;

