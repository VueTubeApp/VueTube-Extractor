type supportedTypes = 'object' | 'array'

type baseRule = {
    type: supportedTypes;
    name?: string;
    aliases?: string[];
    strict?: boolean;
    condition?: (item: any) => boolean | { [key: string]: conditionalRule };
}

interface propertyRule {
    type: supportedTypes
    required?: boolean;
}

interface conditionalRule extends propertyRule {
    expected: any;
}

interface objectRule extends baseRule {
    type: "object";

    properties?: {
        [key: string]: Rule | propertyRule
    };

    keymap?: {
        [key: string]: string
    };

}

interface arrayRule extends baseRule {
    type: "array";
    limit?: number;
    items?: Rule;
}

export type Rule = objectRule | arrayRule;

export type groupedRules = {
    properties: {
        [key: string]: Rule | propertyRule
    }
}

