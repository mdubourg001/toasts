/// <reference types="cypress" />
const { createModel } = require('@xstate/test');

const { translatorMachine } = require('./machine');

const TEST_TIMEOUT = 10000;
const translatorModel = createModel(translatorMachine).withEvents({
  SOURCE_CHANGE: {
    cases: [{ source: 'mot' }, { source: 'azerty123' }, { source: '' }],
  },
  FETCH_TRANSLATION: {},
  'done.invoke.translate': {
    cases: [
      { data: { translation: 'word' } },
      { data: { translation: 'laugh', alternatives: ['laugher'] } },
      { data: {} },
    ],
  },
  'error.platform.translate': {},
  CLEAR: {},
  TOGGLE_ALT: {},
});

describe('translator machine', () => {
  const testPlans = translatorModel.getShortestPathPlans({
    filter: (state) => state.context.translationsMade <= 3,
  });

  for (let plan of testPlans) {
    describe(plan.description, () => {
      for (let path of plan.paths) {
        it(
          path.description,
          () => {
            cy.visit('/');

            path.test();
          },
          TEST_TIMEOUT,
        );
      }
    });
  }

  // it('coverage', () => {
  //   translatorModel.testCoverage();
  // });
});
