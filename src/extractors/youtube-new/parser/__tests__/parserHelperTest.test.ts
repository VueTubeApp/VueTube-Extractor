import {arrayRule, Rule} from "../types";
import {ArrayRuleHelper, ObjectRuleHelper} from "../index";

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