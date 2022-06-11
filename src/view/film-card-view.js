import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import {converterMinutesToDuration} from '../utils/film.js';

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

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setOnLinkClick = (callback) => {
    this._callback.linkClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#onLinkClick);
  };

  setOnWatchlistClick = (callback) => {
    this._callback.watchlistClick  = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#onWatchlistClick);
  };

  setOnWatchedClick = (callback) => {
    this._callback.watchedClick  = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#onWatchedClick);
  };

  setOnFavoriteClick = (callback) => {
    this._callback.favoriteClick  = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#onFavoriteClick);
  };

  #onLinkClick = (evt) => {
    evt.preventDefault();
    this._callback.linkClick();
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #onWatchedClick = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
