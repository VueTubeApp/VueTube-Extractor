// TODO: add tests for the new parser
import {applyObjectRule, ObjectRuleHelper, ArrayRuleHelper} from "../index";
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
                const notObjectRule: arrayRule = {
                    type: "array",
                } as arrayRule;
                expect(() => applyObjectRule({}, notObjectRule)).toThrow(utilityErrors.VueTubeExtractorError);
            });
            test("if applyObjectRule throws an error if the given rule is missing a properties key", () => {
                const rule: objectRule = {
                    type: "object",
                } as objectRule;
                expect(() => applyObjectRule({}, rule)).toThrow(utilityErrors.VueTubeExtractorError);
            });
            test("if applyObjectRule throws an error if the given object is not an object", () => {
                const rule: objectRule = {
                    type: "object",
                    properties: {},
                };
                expect(() => applyObjectRule([], rule)).toThrow(utilityErrors.VueTubeExtractorError);
                expect(() => applyObjectRule("test" as unknown as object, rule)).toThrow(utilityErrors.VueTubeExtractorError);
            });
        });
    })
    // TODO: add more tests
});