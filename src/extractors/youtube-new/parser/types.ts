type supportedTypes = 'object' | 'array' | 'rule'
type propertyType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any' | 'group' | 'rule'

export type conditionalFunction = (item: any) => boolean;

type baseRule = {
    type: supportedTypes;
    name?: string;
    aliases?: string[];
    strict?: boolean;
    condition?: conditionalFunction | { [key: string]: conditionalRule };
}

export interface objectRule extends baseRule {
    type: "object";

    properties: {
        [key: string]: propertyRule | groupedRules;
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

export interface propertyRule {
    type: propertyType
    required?: boolean;
    rule?: Rule;
    default?: any;
}

export interface conditionalRule extends Omit<propertyRule, "default"> {
    expected: any;
}

export interface groupedRules extends Omit<propertyRule, "rule"> {
    type: "group";
    properties: {
        [key: string]: propertyRule
    };
}

