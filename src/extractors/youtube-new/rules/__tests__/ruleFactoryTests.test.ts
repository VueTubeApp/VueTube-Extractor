import ruleFactory from "../index";
import { Rule } from "../../parser/types";
import { utilityErrors } from "../../../../utils";

describe('ruleFactory tests', () => {
    test('ruleFactory should be able to create a rule', () => {
        const factory = new ruleFactory();
        const rule: Rule = {
            type: "array",
            name: "test",
            items: {
                name: "test",
                type: "object",
                properties: {
                    test: {
                        type: "string",
                    },
                },
            },
        };
        factory.createRule(rule);
        expect(factory.getRule("test")).toBe(rule);
    });
})
