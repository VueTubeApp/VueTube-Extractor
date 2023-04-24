# Parser Types Documentation

This documentation for rewritten parser, based on the original rule concept, but with some changes on how rules works.

## Version changes

- Removed redundant `name` and `isDiscoverable` due to remapping and aliases support.
- Aliases can now be applied to primitive properties as well.
- Removed `rule` from property type, subrules now nested directly inside `properties`.
- Rule conditions now merged with properties, and expected value can now be defined inside property itself (currently only to primitives).
- If object rule condition is not met - then it will be null instead of empty object.
- Flatten now can be used in both ways: it now can flatten the first level and subrules with `flatten: true` or flatten the whole object.
- Correct type inference from const rules.

## What is rule?

Rule is a config object, which defines how the input data will be transformed and what data will be extracted after parsing responce. 

Rule can be used for 3 reasons:

1. To ensure type safety by checking if upcoming object has correct signature, and if it's not - the error will be thrown.
2. To transform upcoming object to another for simplification and API compatibility reasons.
3. To extract required properties from complex object.

After rule is defined, it can be used in `parse` function, which then will check and transform this object accordingly.

## Rule definition

Rule definion stays the same, however, to define rule properly and enable type based autocompletion you have to define rule as follows with `as const satisfies Rule` at the end:

```typescript
const rule = {
  type: 'object',
  properties: {
    prop1: {
      type: 'string',
      required: true,
    },
    prop2: {
      type: 'number',
      required: false,
    }
  }
} as const satisfies Rule; // This is important part
```

`as const` will let TypeScript infer a more specific type of the whole object (which will come in handy later), and `satisfies` will enable rule autocompletion inside rule definition. 

After rule is defined, you can use it in parse function, and it will return object with specified type:

```typescript
let item = parse(obj, rule);
//     ^--"item" will have type { prop1: string; prop2?: number; }
```

Because rule has the type as object of concrete values (not `string`, but `'someStr'`), TypeScript can infer type of the return object as well. Under the hood, it uses conditional and remapped types, so value types are important. Without them, it cant determine, what rule is passed as parameter, and this may lead to type errors.

Currently, you can define only const rules with full type support, but I will work on the new `RuleBuilder`, which will provide more convinient way to work with rules in runtime. It still will be a way to work with only finite and known variations of the rule. For example, some situations involving user input or working with api can not be typed at all, so the type can not be inferred in `parse` function:

```typescript

// Some function, that completely relies on user input, for instance, text in TextFields of the UI  
function getUserInput(): string {
  // ...
}

// ...

let rule = {
  type: 'object',
  keymap: {
    // TypeScript can not predict, what user is going to type in text field, so it can not infer correct remapped type
    prop: getUserInput(),
  },
  properties: {
    prop: {
      type: 'string';
    }
  }  
}
```

For this situations, you can use `parseToAny`, which returns `any` type, though it is not recommedended to use due to unexpected return value and possibility to produce bugs:

```typescript
let item = parseToAny(obj, rule);
```

Not all properties have to be defined in type, they will be marked as **NRD**(Not Required to Define) and **RD**(Required to Define).

## Rule props [`type` is **RD**]

Inside `properties` you can define different properties of the object. Supported primitive types are `boolean`, `number`, `string` and `any`, but the later is not recommended to use:

```typescript
const rule = {
  type: 'object',
  properties: {
    strProp: {
      type: 'string',
    },
    numProp: {
      type: 'number',
    },
    boolProp: {
      type: 'boolean',
    },
    anyProp: {
      type: 'any',
    }
  }
} as const satisfies Rule; 

// ...

let item = parse(obj, rule);
//     ^--{ 
//          strProp: string; 
//          numProp: number;
//          boolProp: boolean;
//          anyProp: any;
//        }
```

Properties also supports nesting another rules and types, see [**Subrules**](##subrules)

## Optional Props [**RD**]

Properies by default all required, but can be marked as `required: false` to make this property optional. This will tell parser, that field may be not present inside result object:

```typescript
const rule = {
  type: 'object',
  properties: {
    reqProp: {
      type: 'string',
      required: true, // Default value
    },
    notReqProp: {
      type: 'number',
      required: false,
    },
  }
} as const satisfies Rule;

// ...

let item = parse(obj, rule);
//     ^--{ reqProp: string; notReqProp?: number; }
```

## Strict mode [**RD**]

By default, if property is not present inside object, the type error will be thrown. You can disable this behaviour by using `strict: false` inside rule declaration:

```typescript
const rule = {
  type: 'object',
  strict: false,
  properties: {
    reqProp: {
      type: 'string',
      required: true,
    },
    notReqProp: {
      type: 'number',
      required: false,
    },
  }
} as const satisfies Rule;

// ...

let item = parse(obj, rule);
//     ^--{ reqProp?: string; notReqProp?: number; }
```

If property is not present, then it will have an `undefined` value 

Please note that strict mode only applies inside object which applied to, it does not affect to any nested objects/arrays. 

## Default values [**NRD**]

You can also define default values inside properties. This can also be applied to `required: true` properties when [**Strict mode**](##strict-mode) is disabled:

```typescript
const rule = {
  type: 'object',
  strict: false,
  properties: {
    reqPropWithDef: {
      type: 'string',
      required: true,
      default: 'someVal'
    },
    reqProp: {
      type: 'string',
      required: true,
    },
    notReqProp: {
      type: 'number',
      required: false,
    },
  }
} as const satisfies Rule;

// ...

let item = parse(obj, rule);
//     ^--{ 
//          reqPropWithDef: string; // Not nullable because of default value
//          reqProp?: string;
//          notReqProp?: number;
//        }
```

Default and [object expected](#expected-value) values are not compatible.


## Keymaping [**RD**]

You can remap some of the properties of the object rule, which can be useful in case of [**Aliases**](#property-aliases) to prevent naming collisions and for API compatibility:

```typescript
const rule = {
  type: 'object',
  keymap: {
    prop: 'remappedProp',
  },
  properties: {
    prop: {
      type: 'string',
    },
    defaultProp: {
      type: 'number',
    }
  }
} as const satisfies Rule;

// ...

let item = parse(obj, rule);
//     ^--{ 
//          remappedProp: string;
//          defaultProp: number;
//        }
```

## Property aliases [**RD**]

If same property rule property can be applied to different keys, you can define aliases, which will be applied to different object keys. In event of name collision an error will be thrown:

```typescript
const rule = {
  type: 'object',
  properties: {
    prop: {
      type: 'string',
      aliases: ['aliasProp', 'anotherProp'],
      required: false,
    },
    defaultProp: {
      type: 'number',
    }
  }
} as const satisfies Rule;

// ...

let item = parse(obj, rule);
//     ^--{ 
//          remappedProp?: string;
//          aliasProp?: string;
//          anotherProp?: string;
//          defaultProp: number;
//        }
```

### Caveats

Aliases applied **after** [keymapping](#keymaping-rd), so it is possible to remap current property to prevent name collision:

```typescript
// This code will work correctly and it will not cause an error

const rule = {
  type: 'object',
  keymap: {
    prop: 'remappedProp',
  },
  properties: {
    prop: {
      type: 'string',
      aliases: ['prop', 'anotherProp'],
      required: false,
    },
    defaultProp: {
      type: 'number',
    }
  }
} as const satisfies Rule;

// ...

let item = parse(obj, rule);
//     ^--{ 
//          remappedProp?: string;
//          prop?: string;
//          anotherProp?: string;
//          defaultProp: number;
//        }
```

## Subrules [**RD**]

You can nest rules inside other rules to define complex rule object types, they will have the same behavour, as in previous version, with slightly different syntax:

```typescript

const subRule = {
  type: 'object',
  properties: {
    prop1: {
      type: 'number',
    },
    prop2: {
      type: 'object',
      properties: {
        test: {
          type: 'string',
        }
      }
    }
  }
} as const satisfies Rule;

const rule = {
  type: 'object',
  properties: {
    nonPrimitiveProp: {
      ...subRule,
      required: false,
    },
  },
} as const satisfies Rule;

// ...

let item = parse(obj, rule);
//     ^--{ 
//          nonPrimitiveProp?: {
//            prop1: number,
//            prop2: {
//              test: string,
//            }
//          }  
//        }

```

Please note, that [nested object does not affected by strict rules from the parent rule.](#strict-mode-rd)

## Flatten [**RD**]

In cases where it may be useful to flatten the result, the `flatten `property can be used. Any keys of sub-properties will follow the format `parentKey-childKey`. Keymaps will be applied to the flattened keys. Any object, that also has `flatten: true`, will be flatten as well recursively. All optional properties and strict mode will be taken to account when flatten is applied.

```typescript

const rule = {
  type: 'object',
  flatten: true,
  properties: {
    nonPrimitiveProp: {
      type: 'object',
      flatten: true,
      properties: {
        prop1: {
          type: 'number',
          required: false,
        },
        prop2: {
          type: 'object',
          required: false,
          properties: {
            prop: {
              type: 'string',
            },
            notFlatObj: {
              type: 'object',
              properties: {
                prop: {
                  type: 'number',
                }
              }
            }
          }
        }
      }
    }
  }
} as const satisfies Rule;

// ...

let item = parse(obj, rule);
//     ^--{ 
//          "nonPrimitiveProp-prop1": number, 
//          "nonPrimitiveProp-prop2-prop"?: string, // Flatten because of 'flatten: true' in child
//          "nonPrimitiveProp-prop1-notFlatObj"?: {
//            prop: number,
//          } 
//        }

```

To flatten all subrules, you can use `flattenAll: true`. It will flattens the result no matter has subrule `flatten:true` or not:

```typescript

const rule = {
  type: 'object',
  flattenAll: true,
  properties: {
    nonPrimitiveProp: {
      type: 'object',
      flatten: true,
      properties: {
        prop1: {
          type: 'number',
          required: false,
        },
        prop2: {
          type: 'object',
          required: false,
          properties: {
            prop: {
              type: 'string',
            },
            notFlatObj: {
              type: 'object',
              properties: {
                prop: {
                  type: 'number',
                }
              },
            },
          },
        },
      },
    },
  },
} as const satisfies Rule;

// ...

let item = parse(obj, rule);
//     ^--{ 
//          "nonPrimitiveProp-prop1": number, 
//          "nonPrimitiveProp-prop2-prop"?: string,
//          "nonPrimitiveProp-prop1-notFlatObj-prop"?: number
//        }

```

### Caveats

This option in particular has a lot of caveats on how it will work along with other properties.

WIP.

## Array rules [**RD**]

You can also define array rule type, which will have type of the object, defined inside `items` property:

```typescript
const rule = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      prop: {
        type: 'string'
      },
      nonReqProp: {
        type: 'number',
        required: false,
      }
    }
  }
} as const satisfies Rule

// ...

let item = parse(obj, rule);
//     ^--Array<{ 
//          prop: number, 
//          nonReProp?: number,
//        }>
```

## Conditions [**NRD**]

You can set conditions to array, which will filter all objects inside it.

### Function expression

```typescript
const rule = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      prop: {
        type: 'string'
      },
      nonReqProp: {
        type: 'number',
        required: false,
      }
    }
  },
  condition: (item) => {
    // Leave only items, that have prop equal to 'someStr' 
    return item.prop === 'someStr';
  }
} as const satisfies Rule
```

### Expected value

You can also define expected value for every primitive property. Previous example can be rewritten as follows:

```typescript
const rule = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      prop: {
        type: 'string',
        expected: 'someStr'
      },
      nonReqProp: {
        type: 'number',
        required: false,
      }
    }
  },
} as const satisfies Rule
```

[Default](#default-values-nrd) and object expected values are not compatible.

### Object condition

You can define both types of conditions inside object rules. If object does not satisfy conditions - it will be equal to `undefined`.

```typescript
const rule = {
  type: 'object',
  properties: {
    prop: {
      type: 'string',
      expected: 'someStr'
    },
    nonReqProp: {
      type: 'number'
    }
  },
  condition: (item) => {
    return item.nonReqProp > 10;
  }
} as const satisfies Rule
```

## JSONPath notation [**RD**]

If a rule involves a lot of nesting, it can be tedious to define the path to the property. To make this more concise, you can use JSONPath dot notation to define the path to the property.

It is however considered bad practice to use this feature repeatedly. If you find yourself using this feature a lot, consider refactoring your rule to use sub-rules instead.

```typescript 
const rule = {
    type: 'object',
    properties: {
        'array[0].obj.prop': {
            type: 'string',
            required: false,
        },
    },
} as const satisfies Rule;


// ...

let item = parse(obj, rule);
//     ^--{ 
//          array: Array<{
//            obj: {
//              prop: string,
//            },
//          }>, 
//        }
```