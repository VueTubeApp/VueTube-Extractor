import type { ObjectRule } from "./common";

// TODO: Remake strict

export type RuleStrictMode<Rule extends ObjectRule, Type> = 
  Rule extends { strict: false } ? 
  Partial<Type> : 
  Type;
