import { PROPERTY_TYPES, SUPPORTED_TYPES } from './parser.const';

type supportedTypes = (typeof SUPPORTED_TYPES)[keyof typeof SUPPORTED_TYPES];
type propertyType = (typeof PROPERTY_TYPES)[keyof typeof PROPERTY_TYPES];

export type conditionalFunction = (item: any) => boolean;

type baseRule = {
  type: supportedTypes;
  name: string;
  aliases?: string[];
  strict?: boolean;
  isDiscoverable?: boolean;
  condition?: conditionalFunction | { [key: string]: conditionalRule };
};

export interface objectRule extends baseRule {
  type: 'object';
  flatten?: boolean;

  properties: {
    [key: string]: propertyRule;
  };

  keymap?: {
    [key: string]: string;
  };
}

export interface arrayRule extends baseRule {
  type: 'array';
  limit?: number;
  items: Rule;
}

export type Rule = objectRule | arrayRule;

export interface propertyRule {
  type: propertyType;
  required?: boolean;
  rule?: Rule;
  default?: any;
}

export interface conditionalRule extends Omit<propertyRule, 'default' | 'required'> {
  expected: any;
}

export interface groupedRule extends Omit<propertyRule, 'rule' | 'type'> {
  type: 'group';
  properties: {
    [key: string]: propertyRule;
  };
}
