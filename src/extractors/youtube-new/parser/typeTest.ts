import { objectRule, propertyRule } from './types';

// Common types

type TypeMap = {
  string: string;
  number: number;
  boolean: boolean;
};

type IndexType<Type extends string> = Type extends keyof TypeMap ? TypeMap[Type] : never;

type RuleProps<Rule extends objectRule> = Rule['properties'];

type PrimitiveRuleProps<Rule extends objectRule> = {
  [Key in keyof RuleProps<Rule> as RuleProps<Rule>[Key]['type'] extends keyof TypeMap ? Key : never]: RuleProps<Rule>[Key];
}

type PrimitiveKeys<Rule extends objectRule> = keyof PrimitiveRuleProps<Rule>;

type RuleKeys<Rule extends objectRule> = keyof RuleProps<Rule>;

// Default type

type PropHasDefault<Prop extends propertyRule, KeyType> = Prop extends { default: IndexType<Prop['type']> } ? KeyType : never;

type PropHasNotDefault<Prop extends propertyRule, KeyType> = Prop extends { default: IndexType<Prop['type']> } ? never : KeyType;

// Required prop checking

type PropRequired<Prop extends propertyRule, KeyType> = Prop extends { required: false } ? PropHasDefault<Prop, KeyType> : KeyType;

type PropNotRequired<Prop extends propertyRule, KeyType> = Prop extends { required: false } ? PropHasNotDefault<Prop, KeyType> : never;

type RequiredProps<Rule extends objectRule> = {
  [Key in PrimitiveKeys<Rule> as PropRequired<RuleProps<Rule>[Key], Key>]: IndexType<Rule['properties'][Key]['type']>;
};

type NotRequiredProps<Rule extends objectRule> = {
  [Key in PrimitiveKeys<Rule> as PropNotRequired<RuleProps<Rule>[Key], Key>]?: IndexType<Rule['properties'][Key]['type']>;
};

// Strict mode

type RuleStrictMode<Rule extends objectRule, Type> = Rule extends { strict: false } ? Partial<Type> : Type;

// Apply keymap

type RuleKeyRemap<Rule extends objectRule, Type> = {
  [Key in keyof Type as Key extends keyof Rule['keymap'] ? Rule['keymap'][Key] extends string ? Rule['keymap'][Key] : Key : Key]: Type[Key];
}

export type AppliedObjectRule<Rule extends objectRule> = RuleKeyRemap<
  Rule, 
  RuleStrictMode<
    Rule, 
    RequiredProps<Rule> & NotRequiredProps<Rule>
  >
>;

// Examples

const rule = {
  name: 'someName',
  type: 'object',
  keymap: {
    continuation: 'anotherContuniation',
  },
  properties: {
    continuation: {
      type: 'string',
      required: true,
    },
    reloadContinuationData: {
      type: 'number',
      required: false,
      default: 5,
    },
    nonPrimitive: {
      type: 'object',
      required: true,
    },
  },
} as const;

function typedFunc<const Rule extends objectRule>(obj: any, rule: Rule): AppliedObjectRule<Rule> {
  // ...
  return obj;
}

const item = typedFunc({}, rule);
