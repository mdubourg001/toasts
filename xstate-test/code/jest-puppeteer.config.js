// This is a config file for jest-puppeteer, not for jest
// https://github.com/smooth-code/jest-puppeteer#start-a-server

module.exports = {
  server: {
    command: `yarn develop`,
    port: 3000,
    launchTimeout: 5000,
  },
  launch: {
    headless: true,
  },
};
