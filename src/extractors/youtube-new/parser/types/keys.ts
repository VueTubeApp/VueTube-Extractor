import type { ObjectRule } from "./common";
import type { ObjectRuleProps, PrimitiveRuleProps } from "./props";

export type PrimitiveKeys<Rule extends ObjectRule> = keyof PrimitiveRuleProps<Rule>;

export type ObjectRuleKeys<Rule extends ObjectRule> = keyof ObjectRuleProps<Rule>;
