type supportedTypes = 'object' | 'array' | 'rule'
type propertyType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'rule' | 'any'

type baseRule = {
    type: supportedTypes;
    name?: string;
    aliases?: string[];
    strict?: boolean;
    condition?: (item: any) => boolean | { [key: string]: conditionalRule };
}

export interface propertyRule {
    type: propertyType
    required?: boolean;
    rule?: Rule;
}

export interface conditionalRule extends propertyRule {
    expected: any;
}

export interface objectRule extends baseRule {
    type: "object";

    properties: {
        [key: string]: propertyRule
    };

    keymap?: {
        [key: string]: string
    };

}

export interface arrayRule extends baseRule {
    type: "array";
    limit?: number;
    items: Rule;
}

export type Rule = objectRule | arrayRule;

export type groupedRules = {
    properties: {
        [key: string]: propertyRule
    }
}

