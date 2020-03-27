interface ITranslation {
  [key: string]: { translation: string; alternatives?: string[] };
}

const translations: ITranslation = {
  bonjour: {
    translation: 'hello',
  },
  publicité: {
    translation: 'advertising',
    alternatives: ['publicity', 'advertisement'],
  },
  rire: {
    translation: 'laugh',
    alternatives: ['laughter', 'laughing'],
  },
};

export default translations;
