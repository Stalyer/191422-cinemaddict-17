import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  DETAILS: 'DETAILS',
};

export default class FilmPresenter {
  #filmListContainer = null;
  #filmDetailsContainer = null;
  #filmComponent = null;
  #filmDetailsComponent = null;

  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  #film = null;
  #comments = null;

  constructor(filmListContainer, filmDetailsContainer, changeData, changeMode) {
    this.#filmListContainer = filmListContainer;
    this.#filmDetailsContainer = filmDetailsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film, comments) => {
    this.#film = film;
    this.#comments = comments;

    const prevFilmComponent = this.#filmComponent;
    this.#filmComponent = new FilmCardView(film);

    const openFilmDetails = () => {
      this.#changeMode();
      this.#mode = Mode.DETAILS;
      this.#renderFilmDetails(film, comments);
    };

    this.#filmComponent.setOnLinkClick(openFilmDetails);
    this.#filmComponent.setOnWatchlistClick(this.#onWatchlistClick);
    this.#filmComponent.setOnWatchedClick(this.#onWatchedClick);
    this.#filmComponent.setOnFavoriteClick(this.#onFavoriteClick);

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#filmListContainer);
      return;
    }

    replace(this.#filmComponent, prevFilmComponent);
    remove(prevFilmComponent);
  };

  #onWatchlistClick = () => {
    const filmUpdate = {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}};
    this.#changeData(filmUpdate);
    if (this.#mode === Mode.DETAILS) {
      this.#filmDetailsComponent.reset(filmUpdate);
    }
  };

  #onWatchedClick = () => {
    const filmUpdate = {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}};
    this.#changeData(filmUpdate);
    if (this.#mode === Mode.DETAILS) {
      this.#filmDetailsComponent.reset(filmUpdate);
    }
  };

  #onFavoriteClick = () => {
    const filmUpdate = {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}};
    this.#changeData(filmUpdate);
    if (this.#mode === Mode.DETAILS) {
      this.#filmDetailsComponent.reset(filmUpdate);
    }
  };

  #renderFilmDetails = (film, comments) => {
    const someComments = comments.filter((comment) => film.comments.includes(comment.id));
    this.#filmDetailsComponent = new FilmDetailsView(film, someComments);
    this.#filmDetailsContainer.classList.add('hide-overflow');

    this.#filmDetailsComponent.setOnCloseBtnClick(this.#onCloseFilmDetails);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#filmDetailsComponent.setOnWatchlistClick(this.#onWatchlistClick);
    this.#filmDetailsComponent.setOnWatchedClick(this.#onWatchedClick);
    this.#filmDetailsComponent.setOnFavoriteClick(this.#onFavoriteClick);

    render(this.#filmDetailsComponent, this.#filmDetailsContainer);
  };

  #onCloseFilmDetails = () => {
    this.#filmDetailsContainer.classList.remove('hide-overflow');
    remove(this.#filmDetailsComponent);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#onCloseFilmDetails();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#onCloseFilmDetails();
    }
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmDetailsComponent);
  };
}
