import 'isomorphic-fetch';
import { Config } from '../initializer/config';
import { HomePageController } from '../controllers/homepage.controller';

describe('Controller Tests', () => {
  let validConfig: Config;
  beforeAll(async () => {
    validConfig = new Config();
    await validConfig.getInnertubeConfig();
  });

  describe('Home Page Tests', () => {
    let homePageController: HomePageController;
    beforeAll(() => {
      homePageController = new HomePageController();
    });
    test('Should get a valid request option', () => {
      const requestOptions = homePageController.buildRequestOptions(validConfig);
      expect(typeof requestOptions).toBe('object');
      expect(typeof requestOptions.option).toBe('object');
      expect(typeof requestOptions.option.url).toBe('string');
      expect(typeof requestOptions.option.data).toBe('object');
      expect(typeof requestOptions.option.params).toBe('object');
      expect(typeof requestOptions.option.data.continuation).toBe('undefined');
      const requestOptionsWithContinuation = homePageController.buildRequestOptions(validConfig, 'continuation');
      expect(requestOptionsWithContinuation.option.data.continuation).toBe('continuation');
    });
  });
});
