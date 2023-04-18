import type { PropertyRule } from "./common";
import type { IndexType } from "./appliedRule";

export type PropDefaultSet<Prop extends PropertyRule, KeyType> = 
  Prop extends { default: IndexType<Prop> } ? 
  KeyType : 
  never;

export type PropDefaultNone<Prop extends PropertyRule, KeyType> = 
  Prop extends { default: IndexType<Prop> } ? 
  never : 
  KeyType;
  