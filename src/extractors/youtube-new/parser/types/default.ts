import type { PropertyRule } from "./common";
import type { IndexType } from "./appliedRule";

export type PropDefaultSet<Prop extends PropertyRule, First, Second> = 
  Prop extends { default: IndexType<Prop> } ? 
  First : 
  Second;
