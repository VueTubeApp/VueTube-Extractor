import {UtilsBase} from "../index";

describe("UtilsBase", () => {
    describe("randomMobileUserAgent", () => {
        test("if a random mobile UserAgent is generated", () => {
            const userAgent = UtilsBase.randomMobileUserAgent();
            expect(userAgent.deviceCategory).toMatch("mobile");
        });
    });
    describe("randomString", () => {
        test("if a random string is generated", () => {
            const randomString = UtilsBase.randomString(10);
            expect(randomString.length).toBe(10);
        });
    });
});