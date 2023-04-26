import type { PropertyRule, IndexTypeMap } from './common';

export type PropDefaultSet<Prop extends PropertyRule, First, Second> = Prop extends { default: IndexTypeMap<Prop> } ? First : Second;