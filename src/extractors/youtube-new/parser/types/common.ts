export type TypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  any: any;
};

export type ConditionalFn = (item: any) => boolean;

interface BaseRule {
  type: string;
  name: string;
  aliases?: string[];
  isDiscoverable?: boolean;
};

export interface ObjectRule extends BaseRule {
  type: 'object';
  strict?: boolean;
  flatten?: boolean;
  properties: Record<string, PropertyRule>;
  keymap?: Record<string, string>;
  condition?: ConditionalFn | Record<string, ConditionalRule>;
}

export interface ArrayRule extends BaseRule {
  type: 'array';
  limit?: number;
  items: Rule;
}

export type Rule = ObjectRule | ArrayRule;

interface PrimitivePropertyRule<Key extends keyof TypeMap = keyof TypeMap> {
  type: Key;
  required?: boolean;
  default?: TypeMap[Key];
}

interface ObjectPropertyRule extends ObjectRule {
  required?: boolean;
}

interface ArrayPropertyRule extends ArrayRule {
  required?: boolean;
} 

export type PropertyRule = ArrayPropertyRule | ObjectPropertyRule | PrimitivePropertyRule;

export interface ConditionalRule<Key extends keyof TypeMap = keyof TypeMap> {
  type: Key;
  expected: TypeMap[Key];
}
