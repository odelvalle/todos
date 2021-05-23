var reporter = require('cucumber-html-reporter');

var options = {
  theme: 'bootstrap',
  jsonFile: 'bdd/report/cucumber_report.json',
  output: 'bdd/report/cucumber_report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  metadata: {
      "App Version":"API TODO v1.0",
      "Test Environment": "STAGING",
      "Platform": "Windows 10",
      "Parallel": "Scenarios",
      "Executed": "Local"
  }
};

// @ts-ignore
reporter.generate(options);
