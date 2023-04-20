export type TypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  any: any;
};

export type ConditionalFn = (item: any) => boolean;

export interface ObjectRule {
  type: 'object';
  strict?: boolean;
  flatten?: boolean;
  properties: Record<string, PropertyRule>;
  keymap?: Record<string, string>;
  condition?: ConditionalFn;
}

export interface ArrayRule {
  type: 'array';
  limit?: number;
  items: Rule;
}

export type Rule = ObjectRule | ArrayRule;

type PropertyBase = {
  required?: boolean;
  aliases?: readonly string[];
}

type PrimitivePropertyRule = {
  [Key in keyof TypeMap]: PropertyBase & {
    type: Key;
    default?: TypeMap[Key];
    expected?: TypeMap[Key];
  }
}[keyof TypeMap];

export type ObjectPropertyRule  = ObjectRule & PropertyBase;

type ArrayPropertyRule = ArrayRule & PropertyBase;

export type PropertyRule = ArrayPropertyRule | ObjectPropertyRule | PrimitivePropertyRule;
