export type TypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  any: any;
};

export type IndexTypeMap<Key> = 
  Key extends keyof TypeMap ?
  TypeMap[Key] :
  never;

export type ConditionalFn = (item: any) => boolean;

export interface ObjectRule {
  type: 'object';
  strict?: boolean;
  flatten?: boolean;
  flattenAll?: boolean;
  properties: Record<string, PropertyRule>;
  keymap?: Record<string, string>;
  condition?: ConditionalFn;
}

export interface ArrayRule {
  type: 'array';
  limit?: number;
  items: Rule;
  condition?: ConditionalFn;
}

export type Rule = ObjectRule | ArrayRule;

type PropertyBase = {
  required?: boolean;
  aliases?: readonly string[];
}

type MappedPrimitive<Key extends keyof TypeMap> = PropertyBase & ({
  type: Key;
  default: TypeMap[Key];
  expected?: never;
} | {
  type: Key;
  default?: never;
  expected: TypeMap[Key];
} | {
  type: Key;
  default?: never;
  expected?: never;
});

type PrimitivePropertyRule = {
  [Key in keyof TypeMap]: MappedPrimitive<Key>
}[keyof TypeMap];

export type ObjectPropertyRule  = ObjectRule & PropertyBase;

type ArrayPropertyRule = ArrayRule & PropertyBase;

export type PropertyRule = ArrayPropertyRule | ObjectPropertyRule | PrimitivePropertyRule;

export type ObjectRuleProps<Rule extends ObjectRule> = Rule['properties'];
