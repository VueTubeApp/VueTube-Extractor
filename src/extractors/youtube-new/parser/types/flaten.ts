import type { ObjectRule, ObjectPropertyRule, ObjectRuleProps } from './common';
import type { UnionToIntersection } from './utils';
import type { PropRequired } from './required';
import type { RuleStrictMode } from './strict';
import type { HasCondition } from './condition';

// Helpers
// ========================

type IsFlatten<Rule extends ObjectRule, First, Second> = Rule extends { flatten: true } ? First : Second;

type IsFullFlatten<Rule extends ObjectRule, First, Second> = Rule extends { flattenAll: true } ? First : Second;

type MakeRequiredFalse<Rule extends ObjectPropertyRule, Key extends keyof ObjectRuleProps<Rule>> = Omit<
  ObjectRuleProps<Rule>[Key],
  'required' | 'default'
> & { required: false };

type PropagateOptionalProperty<Rule extends ObjectPropertyRule, Key extends keyof ObjectRuleProps<Rule>> = PropRequired<
  Rule,
  RuleStrictMode<Rule, HasCondition<Rule, MakeRequiredFalse<Rule, Key>, ObjectRuleProps<Rule>[Key]>, MakeRequiredFalse<Rule, Key>>,
  MakeRequiredFalse<Rule, Key>
>;

// Filter keys
// ========================

type ObjectRuleKeys<Rule extends ObjectPropertyRule> = Exclude<
  keyof {
    [Key in keyof ObjectRuleProps<Rule> as ObjectRuleProps<Rule>[Key] extends ObjectPropertyRule ? Key : never]: unknown;
  },
  symbol
>;

// Object props that have { flatten: true }
type FlattenKeys<Rule extends ObjectPropertyRule> = Exclude<
  keyof {
    [Key in keyof ObjectRuleProps<Rule> as ObjectRuleProps<Rule>[Key] extends ObjectRule
      ? IsFlatten<ObjectRuleProps<Rule>[Key], Key, never>
      : never]: unknown;
  },
  symbol
>;

// Flatten types
// ========================

type FlattenProp<PropName extends string | number, Rule extends ObjectPropertyRule> = {
  [Key in Exclude<keyof ObjectRuleProps<Rule>, symbol> as `${PropName}-${Key}`]: PropagateOptionalProperty<Rule, Key>;
};

// flattenAll: true

type OneLevelDeepFlattenRule<Rule extends ObjectPropertyRule> = Omit<Rule, 'properties'> & {
  properties: Omit<ObjectRuleProps<Rule>, ObjectRuleKeys<Rule>> &
    UnionToIntersection<
      {
        [Key in ObjectRuleKeys<Rule>]: ObjectRuleProps<Rule>[Key] extends ObjectPropertyRule
          ? FlattenProp<Key, ObjectRuleProps<Rule>[Key]>
          : never;
      }[ObjectRuleKeys<Rule>]
    >;
};

type DeepFlattenRule<Rule extends ObjectPropertyRule> = Rule extends OneLevelDeepFlattenRule<Rule>
  ? Rule
  : DeepFlattenRule<OneLevelDeepFlattenRule<Rule>>;

// flatten: true

type OneLevelFlattenRule<Rule extends ObjectPropertyRule> = Omit<Rule, 'properties'> & {
  properties: Omit<ObjectRuleProps<Rule>, FlattenKeys<Rule>> &
    UnionToIntersection<
      {
        [Key in FlattenKeys<Rule>]: ObjectRuleProps<Rule>[Key] extends ObjectPropertyRule
          ? FlattenProp<Key, ObjectRuleProps<Rule>[Key]>
          : never;
      }[FlattenKeys<Rule>]
    >;
};

type FlattenRule<Rule extends ObjectPropertyRule> = Rule extends OneLevelFlattenRule<Rule> ? Rule : FlattenRule<OneLevelFlattenRule<Rule>>;

// Applied type
// ========================

export type AppliedFlattenObjectRule<Rule> = Rule extends ObjectRule
  ? IsFullFlatten<
      Rule,
      DeepFlattenRule<Rule>,
      IsFlatten<
        Rule,
        OneLevelDeepFlattenRule<FlattenRule<Rule>>, // Performing one level of flattening
        Rule
      >
    >
  : never;
