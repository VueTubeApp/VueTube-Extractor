import type { ObjectRule } from "./common"

export type RuleKeyRemap<Rule extends ObjectRule, Type> = {
  [Key in keyof Type as Key extends keyof Rule['keymap'] ? Rule['keymap'][Key] extends string ? Rule['keymap'][Key] : Key : Key]: Type[Key];
}