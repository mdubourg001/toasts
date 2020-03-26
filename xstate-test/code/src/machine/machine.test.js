const { createModel } = require('@xstate/test');

const { translatorMachine } = require('./machine');

const TEST_TIMEOUT = 10_000;
const translatorModel = createModel(translatorMachine);

describe('translator machine', () => {
  const testPlans = translatorModel.getShortestPathPlans({
    filter: state => state.context.translationsMade <= 3,
  });

  for (let plan of testPlans) {
    describe(plan.description, () => {
      for (let path of plan.paths) {
        it(
          path.description,
          () => {
            path.test();
          },
          TEST_TIMEOUT,
        );
      }
    });
  }

  it('coverage', () => {
    translatorModel.testCoverage();
  });
});
