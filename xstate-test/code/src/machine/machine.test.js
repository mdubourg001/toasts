/// <reference types="cypress" />
const { createModel } = require('@xstate/test');

const { translatorMachine } = require('./machine');

const TEST_TIMEOUT = 10000;
const translatorModel = createModel(translatorMachine).withEvents({
  SOURCE_CHANGE: {
    exec: (_, event) => {
      cy.get('[data-testid="source-textarea"]').type(event.source);
    },
    cases: [{ source: 'mot' }, { source: 'azerty123' }, { source: '' }],
  },
  FETCH_TRANSLATION: {
    exec: () => {
      cy.get('[data-testid="action-button"]').click();
    },
  },
  'done.invoke.translate': {
    cases: [
      { data: { translation: 'word' } },
      { data: { translation: 'laugh', alternatives: ['laugher'] } },
      { data: {} },
    ],
  },
  'error.platform.translate': {},
  CLEAR: {
    exec: () => {
      cy.get('[data-testid="action-button"]').click();
    },
  },
  TOGGLE_ALT: {
    exec: () => {
      cy.get('[data-testid="alternatives-toggle-button"]').click();
    },
  },
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
