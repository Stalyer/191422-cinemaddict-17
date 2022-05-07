import {createElement} from '../render.js';
import dayjs from 'dayjs';
import {converterMinutesToDuration} from '../utils.js';

const createFilmCardTemplate = (film) => {
  const {comments, filmInfo, userDetails} = film;
  const description = filmInfo.description.length > 140 ? `${filmInfo.description.slice(0, 139)}...` : filmInfo.description;
  const watchlistClassName = userDetails.watchlist ? ' film-card__controls-item--active' : '';
  const alreadyWatchedClassName = userDetails.alreadyWatched ? ' film-card__controls-item--active' : '';
  const favoriteClassName = userDetails.favorite ? ' film-card__controls-item--active' : '';

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${dayjs(filmInfo.release.date).year()}</span>
        <span class="film-card__duration">${converterMinutesToDuration(filmInfo.runtime)}</span>
        <span class="film-card__genre">${filmInfo.genre[0]}</span>
      </p>
      <img src="${filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist${watchlistClassName}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched${alreadyWatchedClassName}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite${favoriteClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView {
  constructor(film) {
    this.film = film;
  }

  _getTemplate() {
    return createFilmCardTemplate(this.film);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this._getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
