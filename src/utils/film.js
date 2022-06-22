import dayjs from 'dayjs';

const converterMinutesToDuration = (time) => {
  const MINUTES_IN_HOUR = 60;
  let duration = '';
  const hours = Math.trunc(time / MINUTES_IN_HOUR);
  const minutes = time % MINUTES_IN_HOUR;
  duration += hours ? `${hours}h ` : '';
  duration += minutes ? `${minutes}m` : '';
  return duration;
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortFilmDate = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.filmInfo.release.date, filmB.filmInfo.release.date);

  return weight ?? dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
};

const sortFilmCommented = (filmA, filmB) => filmB.comments.length - filmA.comments.length;

const sortFilmRated = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

export {converterMinutesToDuration, sortFilmDate, sortFilmCommented, sortFilmRated};
