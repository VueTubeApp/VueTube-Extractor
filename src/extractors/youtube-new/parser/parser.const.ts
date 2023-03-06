export const PRIMITIVES = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
} as const;

export const SUPPORTED_TYPES = {
  OBJECT: 'object',
  ARRAY: 'array',
  RULE: 'rule',
} as const;

export const PROPERTY_TYPES = {
  ...SUPPORTED_TYPES,
  ...PRIMITIVES,
  ANY: 'any',
} as const;
