import { Machine, assign, State } from 'xstate';
import expect from 'expect';

import translations from '../utils/translations';

// ----- types -----

export interface IContext {
  translationsMade: number; // for testing purposes
  source: string;
  translation: string;
  alternatives: string[];
  showAlternatives: boolean;
}

type ITestContext = any;

interface IStateSchema {
  states: {
    idle: {
      meta: {
        test: (testContext: ITestContext, state: State<IContext, IEvent, any, any>) => void;
      };
    };
    fetchTranslation: {
      meta: {
        test: (testContext: ITestContext, state: State<IContext, IEvent, any, any>) => void;
      };
    };
    failure: {
      meta: {
        test: (testContext: ITestContext, state: State<IContext, IEvent, any, any>) => void;
      };
    };
  };
}

export interface IEvent {
  type: string;
  source?: string;
  translation?: string;
  alternatives?: string[];
}

interface IInvokeResolve extends IEvent {
  data?: any;
}

// ----- services -----

const translate = async (context: IContext) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = translations[context.source.toLowerCase()];

      return result
        ? resolve({ translation: result.translation, alternatives: result.alternatives })
        : reject('No match for text to translate.');
    }, 1000);
  });

// ----- guards -----

const isSourceFetchable = (context: IContext) => context.source.length > 0;

// ----- actions -----

const toggleShowAlternatives = assign((context: IContext) => ({
  ...context,
  showAlternatives: !context.showAlternatives,
}));

const clearFields = assign((context: IContext) => ({
  ...context,
  source: '',
  translation: '',
  alternatives: [],
}));

const updateSource = assign((context: IContext, { source }: IEvent) => ({
  ...context,
  source,
  translation: '',
  alternatives: [],
}));

const updateTranslation = assign((context: IContext, { data }: IInvokeResolve) => ({
  ...context,
  translation: data.translation,
  alternatives: data.alternatives || [],
}));

const incrementTranslationsMade = assign((context: IContext) => ({
  ...context,
  translationsMade: context.translationsMade + 1,
}));

// ----- machine -----

export const translatorMachine = Machine<IContext, IStateSchema, IEvent>(
  {
    id: 'translator',
    initial: 'idle',
    on: {
      TOGGLE_ALT: {
        actions: 'toggleShowAlternatives',
      },
    },
    context: {
      translationsMade: 0, // for testing purposes
      source: '',
      translation: '',
      alternatives: [],
      showAlternatives: true,
    },
    states: {
      idle: {
        on: {
          SOURCE_CHANGE: {
            actions: 'updateSource',
          },
          FETCH_TRANSLATION: [{ target: 'fetchTranslation', cond: 'isSourceFetchable' }],
          CLEAR: {
            actions: 'clearFields',
          },
        },
        meta: {
          test: (_, state) => {
            const {
              context: { source, translation, alternatives, showAlternatives },
            } = state;

            cy.get('[data-testid="source-textarea"]').should('not.be.disabled');

            if (source.length > 0) cy.get('[data-testid="source-textarea"]').should('not.be.empty');
            else cy.get('[data-testid="source-textarea"]').should('be.empty');

            if (translation.length > 0)
              cy.get('[data-testid="translation-textarea"]').should('not.be.empty');
            else cy.get('[data-testid="translation-textarea"]').should('be.empty');

            if (alternatives.length > 0) {
              cy.get('[data-testid="alternatives-wrapper"]').should('be.visible');
              if (showAlternatives)
                cy.get('[data-testid="alternatives-list"]').should('be.visible');
              else cy.get('[data-testid="alternatives-list"]').should('not.be.visible');
            } else {
              cy.get('[data-testid="alternatives-wrapper"]').should('not.be.visible');
              cy.get('[data-testid="alternatives-list"]').should('not.be.visible');
            }
          },
        },
      },
      fetchTranslation: {
        entry: 'incrementTranslationsMade',
        invoke: {
          src: 'translate',
          onDone: {
            target: 'idle',
            actions: 'updateTranslation',
          },
          onError: 'failure',
        },
        meta: {
          test: (_, state) => {
            const {
              context: { source, alternatives, translation, translationsMade },
            } = state;

            expect(source.length).toBeGreaterThan(0);
            expect(translation.length).toBe(0);
            expect(translationsMade).toBeGreaterThan(0);
            expect(alternatives.length).toBe(0);

            cy.get('[data-testid="source-textarea"]').should('be.disabled');
            cy.get('[data-testid="source-textarea"]').should('not.be.empty');
            cy.get('[data-testid="spinner-wrapper"]').should('be.visible');
            cy.get('[data-testid="action-button"]').should('be.disabled');
            cy.get('[data-testid="action-button"]').contains('Translate');
          },
        },
      },
      failure: {
        on: {
          CLEAR: {
            target: 'idle',
            actions: 'clearFields',
          },
        },
        meta: {
          test: (_, state) => {
            const {
              context: { source, translation, alternatives },
            } = state;

            expect(source.length).toBeGreaterThan(0);
            expect(translation.length).toBe(0);
            expect(alternatives.length).toBe(0);

            cy.get('[data-testid="source-textarea"]').should('be.disabled');
            cy.get('[data-testid="source-textarea"]').should('not.be.empty');
            cy.get('[data-testid="error-wrapper"]').should('be.visible');
            cy.get('[data-testid="action-button"]').should('not.be.disabled');
            cy.get('[data-testid="action-button"]').contains('Clear');
          },
        },
      },
    },
  },
  {
    actions: {
      toggleShowAlternatives,
      clearFields,
      updateSource,
      updateTranslation,
      incrementTranslationsMade,
    },
    services: {
      translate,
    },
    guards: {
      isSourceFetchable,
    },
  },
);
