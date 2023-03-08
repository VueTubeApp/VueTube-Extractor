import { Rule } from '../parser/types';

export const CONTINUATIONS: Rule = {
  type: 'array',
  name: 'continuations',
  items: {
    name: 'continuationArray',
    type: 'object',
    properties: {
      nextContinuationData: {
        type: 'rule',
        rule: {
          type: 'object',
          name: 'continuation',
          properties: {
            continuation: {
              type: 'string',
            },
          },
        },
      },
      reloadContinuationData: {
        type: 'rule',
        rule: {
          type: 'object',
          name: 'continuation',
          properties: {
            continuation: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
