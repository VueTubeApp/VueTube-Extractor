// TODO: add tests for the new parser
import {ObjectRuleParser} from "../index";
import {Rule} from "../types";
import {utilityErrors} from "../../../../utils";

describe("Parser Tests", () => {
    describe("ObjectRule Tests", () => {
        describe("applyObjectRule error handling", () => {
            test("if applyObjectRule throws an error if the given rule is not an object rule", () => {
                // @ts-expect-error incomplete rule
                const notObjectRule: Rule = {
                    type: "array",
                };
                expect(() => {
                    // @ts-expect-error incorrect rule type
                    new ObjectRuleParser({}, notObjectRule);
                }).toThrow(utilityErrors.VueTubeExtractorError);
            });
            test("if applyObjectRule throws an error if the given rule is missing a properties key", () => {
                // @ts-expect-error missing properties key
                const missingPropertiesRule: Rule = {
                    type: "object",
                };
                expect(() => {
                    // @ts-expect-error missing properties key
                    new ObjectRuleParser({}, missingPropertiesRule);
                }).toThrow(utilityErrors.VueTubeExtractorError);
            });
            test("if applyObjectRule throws an error if the given object is not an object", () => {
                const notObjRule: Rule = {
                    type: "object",
                    properties: {},
                };
                expect(() => {
                    new ObjectRuleParser([], notObjRule);
                }).toThrow(utilityErrors.VueTubeExtractorError);
                expect(() => {
                    // @ts-expect-error not an actual object
                    new ObjectRuleParser("test", notObjRule);
                }).toThrow(utilityErrors.VueTubeExtractorError);
            });
            test("if applyObjectRule throws an error if the type of a property is not supported", () => {
                const notSupportedTypeRule: Rule = {
                    type: "object",
                    properties: {
                        test: {
                            // @ts-expect-error bad type
                            type: "test",
                        },
                    },
                };
                // @ts-expect-error bad type
                const testParser = new ObjectRuleParser({test: "test"}, notSupportedTypeRule)
                expect(() => testParser.parse()).toThrow(utilityErrors.VueTubeExtractorError);
            });
            test("if sub-rule errors are handled correctly", () => {
                const badSubRule: Rule = {
                    type: "object",
                    properties: {
                        test: {
                            type: "string",
                        }
                    }
                }
                const badMapRule: Rule = {
                    type: "object",
                    properties: {
                        test: {
                            type: 'rule',
                            rule: badSubRule
                        }
                    }
                }
                const testParser = new ObjectRuleParser({test: {test:12345}}, badMapRule);
                expect(() => testParser.parse()).toThrow(utilityErrors.VueTubeExtractorError);
            });
        });
        describe("applyObjectRule functionality", () => {
            test("if applyObjectRule correctly applies a bare minimum rule", () => {
                const basicRule: Rule = {
                    type: "object",
                    properties: {
                        test: {
                            type: "string",
                        },
                    },
                };
                const testParser = new ObjectRuleParser({test: "test"}, basicRule);
                expect(testParser.parse()).toEqual({test: "test"});
            });
            test("if applyObjectRule correctly applies a rule with a keymap", () => {
                const keyMappedRule: Rule = {
                    type: "object",
                    properties: {
                        test: {
                            type: "string",
                        },
                    },
                    keymap: {
                        test: "test2",
                    }
                };
                const testParser = new ObjectRuleParser({test: "test"}, keyMappedRule);
                expect(testParser.parse()).toEqual({test2: "test"});
            });
            test("if applyObjectRule correctly applies a rule with a condition", () => {
                const conditionRule: Rule = {
                    type: "object",
                    properties: {
                        test: {
                            type: "string",
                        },
                    },
                    condition: (object) => object.test === "test",
                };
                const testParser = new ObjectRuleParser({test: "test2"}, conditionRule);
                expect(testParser.parse()).toEqual(undefined);
            });
            describe('applyObjectRule properties tests', function () {
                test("if applyObjectRule correctly applies a rule with a required property (strict mode)", () => {
                    const missingRequiredRule: Rule = {
                        type: "object",
                        strict: true,
                        properties: {
                            test: {
                                type: "string",
                                required: true,
                            },
                        },
                    };
                    const testParser = new ObjectRuleParser({}, missingRequiredRule);
                    expect(() => testParser.parse()).toThrow(utilityErrors.VueTubeExtractorError);
                });
                test("if applyObjectRule correctly applies a rule with a required property (non-strict mode)", () => {
                    const missingOptionalRule: Rule = {
                        type: "object",
                        strict: false,
                        properties: {
                            test: {
                                type: "string",
                                required: true,
                            },
                        },
                    };
                    const testParser = new ObjectRuleParser({}, missingOptionalRule);
                    expect(testParser.parse()).toEqual(undefined);
                });
                test("if applyObjectRule correctly drops a non-required property", () => {
                    const extraPropertyRule: Rule = {
                        type: "object",
                        strict: true,
                        properties: {
                            test: {
                                type: "string",
                                required: false,
                            },
                        },
                    };
                    const testParser = new ObjectRuleParser({test: 1}, extraPropertyRule);
                    expect(testParser.parse()).toEqual(undefined);
                });
                test("if applyObjectRule correctly applies a rule with a default property", () => {
                    const propertyWithDefaultRule: Rule = {
                        type: "object",
                        strict: true,
                        properties: {
                            test: {
                                type: "string",
                                required: true,
                                default: "test",
                            },
                            test2: {
                                type: "string",
                                required: false,
                                default: "test2",
                            },
                            test3: {
                                type: "object",
                                required: false,
                                default: {
                                    test: "test"
                                }
                            },
                        },
                    };
                    const testParser = new ObjectRuleParser({}, propertyWithDefaultRule);
                    expect(testParser.parse()).toEqual({test: "test", test2: "test2", test3: {test: "test"}});
                });
                test("if applyObjectRule correctly applies a rule with a sub-rule", () => {
                    const subRule: Rule = {
                        type: "object",
                        strict: true,
                        properties: {
                            test: {
                                type: "string",
                                required: true,
                            },
                        },
                    };
                    const propertyWithSubRule: Rule = {
                        type: "object",
                        strict: true,
                        properties: {
                            test: {
                                type: "rule",
                                required: true,
                                rule: subRule,
                            },
                        },
                    };
                    const testParser = new ObjectRuleParser({
                        test: {
                            test: "test",
                            ignoredValue: "test"
                        },
                        ignoredValue: "test"
                    }, propertyWithSubRule);
                    expect(testParser.parse()).toEqual({test: {test: "test"}});
                });
            });
        });
    })
    // TODO: add more tests
});