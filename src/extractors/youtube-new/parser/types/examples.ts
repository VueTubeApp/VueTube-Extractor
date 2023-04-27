import type { Rule } from "./common";
import type { AppliedRule } from "./appliedRule";

// Rewritten continuation rule from "../../rules/continuations.const.ts"

const continuation = {
  type: 'object',
  properties: {
    continuation: {
      type: 'string',
    },
  },
} as const satisfies Rule;

export const CONTINUATIONS = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      nextContinuationData: {
        ...continuation,
        aliases: ['reloadContinuationData']
      }
    },
  },
} as const satisfies Rule;

// Examples

const subRule = {
  type: 'object',
  properties: {
    item: {
      type: 'number',
      default: 3,
    },
    item2: {
      required: true,
      type: 'object',
      properties: {
        prop1: {
          type: 'string',
          default: 'someDefault',
        },
        prop2: {
          type: 'object',
          properties: {
            prop: {
              type: 'number',
              default: 4
            }
          }
        }
      }
    }
  }
} as const satisfies Rule;

const rule = {
  type: 'object',
  flatten: true,
  keymap: {
    continuation: 'remapedContuniation',
    nonPrimitive: 'remapedNonPrimitive',
  },
  properties: {
    "obj.another.arr[0].obj": {
      type: 'string',
      required: true,
    },
    obj: {
      type: 'object',
      properties: {
        prop: {
          type: 'number'
        }
      }
    },
    continuation: {
      aliases: ['contAlias'],
      type: 'string',
      required: true,
      default: '',
    },
    reloadContinuationData: {
      aliases: ['continuation'],
      type: 'number',
      required: false,
    },
    nonPrimitive: {
      ...subRule,
      required: false,
      flatten: true,
    },
  },
} as const satisfies Rule;

function typedFunc<const RuleType extends Rule>(obj: any, rule: RuleType): AppliedRule<RuleType> {
  // ...
  return obj;
}

// Here you can analyse what properties item will have after rule is applied

const item = typedFunc({}, rule);
