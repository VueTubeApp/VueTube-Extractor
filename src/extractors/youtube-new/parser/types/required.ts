import type { PropertyRule } from "./common";

export type PropRequired<Prop extends PropertyRule, First, Second> = 
  Prop extends { required: false } ? 
  Second : 
  First;
