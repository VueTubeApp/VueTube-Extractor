import type { ObjectRule } from "./common";


export type RuleStrictMode<Rule extends ObjectRule, First, Second> = 
  Rule extends { strict: false } ?
  Second : 
  First;
