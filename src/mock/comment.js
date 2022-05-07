import dayjs from 'dayjs';
import {getRandomInteger, getRandomArrayElement} from '../utils.js';
import {EMOTIONS} from '../const.js';

const AUTHORS = [
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

const COMMENTS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.'
];

let commentsCount = 0;

export const generateComment = () => {
  commentsCount++;

  return {
    id: commentsCount,
    author: getRandomArrayElement(AUTHORS),
    comment: getRandomArrayElement(COMMENTS),
    date: dayjs().subtract(getRandomInteger(1, 20), 'day').format(),
    emotion: getRandomArrayElement(EMOTIONS)
  };
};
