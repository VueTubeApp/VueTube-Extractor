// TODO: add tests for the new parser
import {ObjectRuleHelper, ArrayRuleHelper, ObjectRuleParser} from "../index";
import {objectRule, arrayRule} from "../types";
import {utilityErrors} from "../../../../utils";

describe("Helper Tests", () => {
    describe("ObjectRuleHelper Tests", () => {
        test("if fillRule correctly defaults a given rule", () => {
            const rule: objectRule = {
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
            const rule: objectRule = {
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
                const notObjectRule: objectRule = {
                    type: "array",
                } as unknown as objectRule;
                const testParser = new ObjectRuleParser({}, notObjectRule);
                expect(() => testParser.parse()).toThrow(utilityErrors.VueTubeExtractorError);
            });
            test("if applyObjectRule throws an error if the given rule is missing a properties key", () => {
                const missingPropertiesRule: objectRule = {
                    type: "object",
                } as objectRule;
                const testParser = new ObjectRuleParser({}, missingPropertiesRule);
                expect(() => testParser.parse()).toThrow(utilityErrors.VueTubeExtractorError);
            });
            test("if applyObjectRule throws an error if the given object is not an object", () => {
                const notObjRule: objectRule = {
                    type: "object",
                    properties: {},
                };
                const testParser = new ObjectRuleParser([], notObjRule);
                const testParser2 = new ObjectRuleParser("test" as unknown as object, notObjRule);
                expect(() => testParser.parse()).toThrow(utilityErrors.VueTubeExtractorError);
                expect(() => testParser2.parse()).toThrow(utilityErrors.VueTubeExtractorError);
            });
        });
        describe("applyObjectRule functionality", () => {
            test("if applyObjectRule correctly applies a bare minimum rule", () => {
                const basicRule: objectRule = {
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
                const keyMappedRule: objectRule = {
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
                const conditionRule: objectRule = {
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
                    const missingRequiredRule: objectRule = {
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
                    const missingOptionalRule: objectRule = {
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
                    const extraPropertyRule: objectRule = {
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
                    const propertyWithDefaultRule: objectRule = {
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
                                type: "rule",
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
            });
        });
    })
    // TODO: add more tests
});