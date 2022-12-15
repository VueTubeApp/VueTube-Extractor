# YouTube-New

## Table of Contents

<!-- TOC -->
* [YouTube-New](#youtube-new)
  * [Table of Contents](#table-of-contents)
* [About](#about)
* [Overview](#overview)
* [Documentation](#documentation)
  * [Optional Properties](#optional-properties)
    * [Default Values](#default-values)
  * [Type Checking](#type-checking)
    * [Strict Mode](#strict-mode)
  * [Sub-Rules](#sub-rules)
    * [Aliases](#aliases)
  * [Key Mapping](#key-mapping)
  * [Result Grouping](#result-grouping)
  * [Arrays](#arrays)
  * [Conditional Rule Application](#conditional-rule-application)
    * [Functional Conditions](#functional-conditions)
    * [Rule Conditions](#rule-conditions)
<!-- TOC -->

# About

The original YouTube extractor was written earlier in the project's development, and due to my inexperience with the
YouTube API, it quickly became unmaintainable. This is a rewrite of the original extractor, with a focus on
maintainability and readability.

Upon completion, this extractor will replace the current extractor in the repository. **The current extractor is now
considered deprecated, and will not be updated.**

# Overview

Whereas the original extractor was a monolithic class, the rewrite will focus on a modular approach. A single
generic function would handle traversing a given JSON object following "rules" defined in a separate files.

The aim is to identify the most common patterns in the YouTube API, and create a set of rules that can be applied to
each given pattern. In doing so, it will allow for easier maintenance and expansion of the codebase as well as an
overall more robust and testable extractor.

# Documentation

**Note:** Since the rewrite is still in work, most of the features described here are not yet implemented.

A rule for the `continuation` object would be defined as follows:

```typescript
const continuationRule: Rule = {
    type: 'object',
    properties: {
        continuation: {
            type: 'string',
            required: true, // By default, all properties are required
        },
        reloadContinuationData: {
            type: 'string',
            required: false,
        },
    },
};
```

## Optional Properties

Properties can be marked as optional by setting the `required` property to `false`. This is useful for when a property
may or may not be present in the JSON object.
```typescript
const optionalPropertyExample: Rule = {
    type: 'object',
    properties: {
        optionalProperty: {
            type: 'string',
            required: false,
        },
    },
};
```

### Default Values

Optional properties can also have a default value by setting the `default` property. This is redundant if the property
is not set to `required: false` as in that case, the property will always be present. However, it can be useful for
better readability.
```typescript
const defaultExample: Rule = {
    type: 'object',
    properties: {
        optionalPropertyWithDefault: {
            type: 'string',
            required: false,
            default: 'default value',
        },
    },
};
```

## Type Checking

To prevent unnecessary runtime errors, it is advised to use the `type` property to ensure type safety. Supports the
following types: 'string', 'number', 'boolean', 'object', 'array' and 'any' (not recommend)

Although not the property is not strictly necessary, the rest of this documentation will use the `type` property to
ensure type safety.

Setting required to `false` will result in the property becoming undefined instead, but it is still recommended to use
the type property for better readability.

```typescript
const typedExample: Rule = {
    type: 'object',
    properties: {
        property1: {
            type: 'string',
            required: true
        },
        property2: {
            type: 'number',
            required: true,
        },
        property3: {
            type: 'boolean',
            required: false,
        },
    },
};

const exampleObject = {
    property1: 'string',
    property2: "not a number", // Will cause a TypeError to be thrown
    property3: 'string', // Undefined
};
```

### Strict Mode

By default, strict mode is enabled. This means that any properties that are not defined in the rule will cause a
TypeError. In the example above, `property2` would cause a TypeError to be thrown. To disable strict mode, set
the `strict` property to `false`. In this case, property2 would be undefined and property3 will be empty.

```typescript
const strictExample: Rule = {
    type: 'object',
    strict: false,
    properties: {
        property1: {
            type: 'string',
            required: true,
        },
        property2: {
            type: 'number',
            required: true,
        },
        property3: {
            type: 'object',
            required: true,
        }
    },
};

const exampleObject = {
    property1: 'string', // Will be 'string'
    property2: 'not a number', // Will result in an undefined value
    property3: 'not an object', // Will be an empty object
};
```

## Sub-Rules

To avoid a single monolithic rule, sub-rules can be defined and referenced by the parent rule. Alternatively, sub-rules
can
also be automatically applied where applicable (on by default).

By default, all rules will be discoverable as sub-rules. If the name property is not set, the variable's name will be
assumed to be the name of the sub-rule. In the event of a name collision, an error will be thrown.

To disable automatic sub-rule discovery, set the `isDiscoverable` property to `false`.

```typescript
export const subRuleExample: Rule = {
    type: 'object',
    name: 'exampleSubRule',
    properties: {
        property1: {
            type: 'string',
            required: true,
        },
        property2: {
            type: 'number',
            required: true,
        },
    },
};

const autoRuleExample: Rule = {
    type: 'object',
    autoApply: true, // optional, defaults to true
}

const definedRuleExample: Rule = {
    type: 'object',
    properties: {
        continuations: {
            type: 'rule',
            rule: subRuleExample,
        },
    },
}
```

### Aliases

In cases where the same sub-rule can be applied to multiple keys, aliases can be defined to avoid repetition.

```typescript
export const aliasedRuleExample: Rule = {
    name: 'mainName',
    aliases: ['secondaryName', "tertiaryName"],
    type: 'object',
    properties: {
        // ...
    },
};
```

## Key Mapping

By default, the extractor will automatically use the same key names as the YouTube API. However, this can be
changed by defining a `keyMap` in the rule. This is useful for when the key names are not consistent across the API.
(Keymaps present in a sub-rule will take precedence over the parent rule.)

```typescript
const keyMappedRuleExample: Rule = {
    type: 'object',
    keyMap: {
        property1: 'renamedProperty1',
        property2: 'renamedProperty2',
    },
    properties: {
        property1: {
            type: 'string',
            required: true,
        },
        property2: {
            type: 'number',
            required: true,
        },
    },
};
```

## Result Grouping

In cases where a given object have multiple properties, it may be desirable to group them together. This can be achieved
by defining a `group` rule type. This can take the form of a sub-object, or a sub-array.

```typescript
export const groupExample: groupedRule = {
    properties: {
        continuation: {
            type: 'string',
            required: true,
        },
        reloadContinuationData: {
            type: 'string',
            required: false,
        },
    },
};
```

The group can then be referenced by the parent rule.

```typescript
const ruleWithGroupExample: Rule = {
    type: 'object',
    properties: {
        continuations: {
            type: 'group',
            group: groupExample,
        },
    },
};
```

## Arrays

The extractor will also be able to handle arrays of objects, and will automatically apply the same rules to each item
in the array.

```typescript
const arrayRuleExample: Rule = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            property1: {
                type: 'string',
                required: true,
            },
            property2: {
                type: 'number',
                required: true,
            },
        },
    },
}

const EXAMPLE_DATA = [
    {
        continuation: "token1",
        reloadContinuationData: "token2",
        irrelevant: "data",
    }, {
        continuation: "token3",
        otherIrrelevant: "data",
    },
    // and so on...
]

applyRule(EXAMPLE_DATA, arrayRuleExample)
// [
//    {
//        continuation: "token1",
//        reloadContinuationData: "token2",
//    }, {
//        continuation: "token3",
//    },
//    and so on...
// ]  
```

You can also define a limit on the number of items to be processed.

```typescript
const limitedArrayRuleExample: Rule = {
    type: 'array',
    limit: 5, // optional, defaults to 0 (no limit)
    items: {
        type: 'object',
        properties: {
            property1: {
                type: 'string',
                required: true,
            },
            property2: {
                type: 'number',
                required: true,
            },
        },
    },
}
```

## Conditional Rule Application

By default, the extractor will apply the same rules to each item in an array. However, this may not always be the most
appropriate approach. For instance, there may be ads in the array that need to be filtered out. In this case, you can
add a `condition` to the rule, which will be evaluated for each item in the array. If the condition evaluates to true,
then the rule will be applied to that item.

```typescript
const conditionalRuleExample: Rule = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            realData: {
                type: 'object',
                required: true,
            },
            isAd: {
                type: 'boolean',
                required: true,
            }
        },
        condition: (item) => item.isAd === false,
    },
}
```

Conditions can also be applied to objects. In this case, if the condition evaluates to false, then the rule will return
an empty object. All sub-rules will also be ignored.

```typescript
const objectConditionalRuleExample: Rule = {
    type: 'object',
    properties: {
        realData: {
            type: 'object',
            required: true,
        },
        isAd: {
            type: 'boolean',
            required: true,
        }
    },
    condition: (item) => item.isAd === false,
}
```

### Functional Conditions

In cases where conditions are too complex to be defined as a single conditional statement, you can also define a custom
function to be used for evaluating the condition.

```typescript
const functionalConditionalRuleExample: Rule = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            realData: {
                type: 'object',
                required: true,
            },
            isAd: {
                type: 'boolean',
                required: true,
            }
        },
        condition: (item) => {
            if (item.isAd === false) {
                return true;
            }
            if (item.realData === null) {
                return false;
            }
            return true;
        },
    },
}
```

### Rule Conditions

Alternatively, a special `condition` rule can be used to define a condition for the parent rule.

```typescript
const ruleConditionConditionalRuleExample: Rule = {
    type: 'array',
    condition: {
        type: 'object',
        properties: {
            isAd: {
                type: 'boolean',
                required: true,
                expected: false,
            }
        }
    },
    items: {
        type: 'object',
        properties: {
            realData: {
                type: 'object',
                required: true,
            },
            isAd: {
                type: 'boolean',
                required: true,
            }
        },
    },
}
```