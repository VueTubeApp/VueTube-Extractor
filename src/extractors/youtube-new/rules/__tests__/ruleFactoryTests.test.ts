import ruleFactory from "../index";
import { Rule } from "../../parser/types";
import { utilityErrors } from "../../../../utils";

describe('ruleFactory tests', () => {
    let factory: ruleFactory;
    beforeEach(() => {
        // create a new rule factory before each test
        factory = new ruleFactory();
    });
    test('ruleFactory should be able to create a rule', () => {
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
    test('ruleFactory should be able to create a rule with aliases', () => {
        const rule: Rule = {
            type: "array",
            name: "test",
            aliases: ["test2"],
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
        expect(factory.getRule("test2")).toBe(rule);
    });
    test('ruleFactory should be able to populate a rule with sub-rules', () => {
        const subRule: Rule = {
            type: "object",
            name: "testSubrule",
            properties: {
                foo: {
                    type: "string",
                }
            }
        }
        const rule: Rule = {
            type: "object",
            name: "test",
            properties: {
                bar: {
                    type: "string",
                }
            }
        }
        const expectedRule: Rule = rule;
        expectedRule.properties["testSubrule"] = subRule;
        const responseObject = {
            bar: "test",
            testSubrule: {
                foo: "test",
            }
        }
        factory.createRule(subRule);
        const actualRule = factory.getSubRules(rule, responseObject);
        expect(actualRule).toEqual(expectedRule);
    });
})
