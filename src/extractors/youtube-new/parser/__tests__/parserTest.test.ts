// TODO: add tests for the new parser
import {ObjectRuleHelper, ArrayRuleHelper, ObjectRuleParser} from "../index";
import {objectRule, arrayRule, Rule} from "../types";
import {utilityErrors} from "../../../../utils";

describe("Helper Tests", () => {
    describe("ObjectRuleHelper Tests", () => {
        test("if fillRule correctly defaults a given rule", () => {
            const rule: Rule = {
                type: "object",
                properties: {
                    test: {
                        type: "string",
                    },
                },
            };
            const Helper = new ObjectRuleHelper(rule);
            expect(Helper.fillRule()).toEqual({
                type: "object",
                properties: {
                    test: {
                        type: "string",
                        required: true,
                    },
                },
                strict: true,
                keymap: {},
                condition: expect.any(Function),
            });
        });
    });
    describe("ArrayRuleHelper Tests", () => {
        test("if fillRule correctly defaults a given rule", () => {
            const rule: arrayRule = {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        test: {
                            type: "string",
                        }
                    }
                },
            };
            const Helper = new ArrayRuleHelper(rule);
            expect(Helper.fillRule()).toEqual({
                type: "array",
                limit: 0,
                items: {
                    type: "object",
                    properties: {
                        test: {
                            type: "string",
                        }
                    }
                },
                strict: true,
                condition: expect.any(Function),
            });
        });
    });
    describe("General Helper Tests", () => {
        let Helper: ObjectRuleHelper;
        beforeAll(() => {
            const rule: Rule = {
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
            Helper = new ObjectRuleHelper(rule);
        });
        test("if checkTypeGuard correctly checks a type guard", () => {

            expect(Helper.checkTypeGuard("test", "string")).toBe(true);
            expect(Helper.checkTypeGuard(1, "string")).toBe(false);
        });
        test("if followKeymap correctly follows a keymap", () => {
            expect(Helper.followKeymap("test")).toBe("test2");
            expect(Helper.followKeymap("test2")).toBe("test2");
        })
    });
});

describe("Parser Tests", () => {
    describe("ObjectRule Tests", () => {
        describe("applyObjectRule error handling", () => {
            test("if applyObjectRule throws an error if the given rule is not an object rule", () => {
                const notObjectRule: Rule = {
                    type: "array",
                } as unknown as objectRule;
                expect(() => {
                    new ObjectRuleParser({}, notObjectRule);
                }).toThrow(utilityErrors.VueTubeExtractorError);
            });
            test("if applyObjectRule throws an error if the given rule is missing a properties key", () => {
                const missingPropertiesRule: Rule = {
                    type: "object",
                } as objectRule;
                expect(() => {
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
                    new ObjectRuleParser("test" as unknown as object, notObjRule);
                }).toThrow(utilityErrors.VueTubeExtractorError);
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