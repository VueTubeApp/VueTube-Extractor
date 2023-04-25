import type { ObjectRule, PropertyRule, ObjectRuleProps } from "./common";
import type { PickNever } from "./utils";

type ArraySeparator = '[0]';

type ObjectSeparator = '.';

type ExtractKey<Key extends string | number | symbol> = 
  Key extends `${infer Prefix}${ObjectSeparator}${string | number}` ?
  Prefix extends `${infer InnerPrefix}${ArraySeparator}` ?
  InnerPrefix :
  Prefix :
  Key;
  
type Extract<Key extends string | number | symbol, Prop extends PropertyRule> =  
  Key extends `${infer Prefix}${ObjectSeparator}${infer Postfix}` ?
  Prefix extends `${string | number}${ArraySeparator}` ?
  { 
    type: 'array',
    items: {
      type: 'object';
      properties: {
        [Key in ExtractKey<Postfix>]: Extract<Postfix, Prop>
      }
    }
  } :
  { 
    type: 'object',
    properties: {
      [Key in ExtractKey<Postfix>]: Extract<Postfix, Prop>
    }
  } :
  Prop;

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

