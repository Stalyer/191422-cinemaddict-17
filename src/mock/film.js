import dayjs from 'dayjs';
import {getRandomInteger, getRandomFloat, getRandomArrayElement} from '../utils.js';

const NAMES = [
  'Tom Ford',
  'Takeshi Kitano',
  'Morgan Freeman',
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryea'
];

const TITLES = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor'
];

const ALTERNATIVE_TITLES = [
  'Original: The Dance of Life',
  'Original: Sagebrush Trail',
  'Original: The Man with the Golden Arm',
  'Original: Santa Claus Conquers the Martians',
  'Original: Popeye the Sailor Meets Sindbad the Sailor'
];

const AGE_RATINGS = [0, 12, 16, 18];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.'
];

const GENRES = [
  'Comedy',
  'Cartoon',
  'Musical',
  'Western'
];

const COUNTRIES = [
  'Finland',
  'USA',
  'Russia',
  'Germany'
];

const COMMENTS_IDS = [1, 2, 3, 4, 5];

const generatePoster = () => {
  const posters = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];

  return `./images/posters/${getRandomArrayElement(posters)}`;
};

let filmsCount = 0;

export const generateFilm = () => {
  filmsCount++;

  return {
    id: filmsCount,
    comments: COMMENTS_IDS.slice(0, getRandomInteger(1, COMMENTS_IDS.length - 1)),
    filmInfo: {
      title: getRandomArrayElement(TITLES),
      alternativeTitle: getRandomArrayElement(ALTERNATIVE_TITLES),
      totalRating: getRandomFloat(1, 10, 1),
      poster: generatePoster(),
      ageRating: getRandomArrayElement(AGE_RATINGS),
      director: getRandomArrayElement(NAMES),
      writers: NAMES.slice(0, getRandomInteger(1, NAMES.length - 1)),
      actors: NAMES.slice(0, getRandomInteger(1, NAMES.length - 1)),
      release: {
        date: dayjs().subtract(getRandomInteger(1, 10), 'year').format(),
        releaseCountry: getRandomArrayElement(COUNTRIES)
      },
      runtime: getRandomInteger(60, 180),
      genre: GENRES.slice(0, getRandomInteger(1, GENRES.length - 1)),
      description: getRandomArrayElement(DESCRIPTIONS),
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched:  Boolean(getRandomInteger(0, 1)),
      watchingDate: dayjs().subtract(getRandomInteger(1, 12), 'month').format(),
      favorite:  Boolean(getRandomInteger(0, 1))
    }
  };
};
