import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import {UserAction, UpdateType, FilterType} from '../const.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #filmComponent = null;
  #filterModel = null;

  #changeData = null;
  #changeMode = null;

  #film = null;

  constructor(filmListContainer, changeData, changeMode, filterModel) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#filterModel = filterModel;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmComponent = this.#filmComponent;
    this.#filmComponent = new FilmCardView(film);

    const openFilmDetails = () => {
      this.#changeMode(film);
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
    if (this.#filterModel.filter !== FilterType.ALL && this.#filterModel.filter === FilterType.WATCHLIST) {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.MAJOR, {film: filmUpdate});
    } else {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.PATCH, {film: filmUpdate});
    }
  };

  #onWatchedClick = () => {
    const filmUpdate = {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched, watchingDate: !this.#film.userDetails.alreadyWatched ? new Date() : null }};
    if (this.#filterModel.filter !== FilterType.ALL && this.#filterModel.filter === FilterType.HISTORY) {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.MAJOR, {film: filmUpdate});
    } else {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.PATCH, {film: filmUpdate});
    }
  };

  #onFavoriteClick = () => {
    const filmUpdate = {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}};
    if (this.#filterModel.filter !== FilterType.ALL && this.#filterModel.filter === FilterType.FAVORITES) {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.MAJOR, {film: filmUpdate});
    } else {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.PATCH, {film: filmUpdate});
    }
  };

  setUpdateFilmCard = () => {
    this.#filmComponent.updateElement({isDisabled: true});
  };

  setUpdateFilmCardAborting = () => {
    const resetFilmCardState = () => {
      this.#filmComponent.updateElement({isDisabled: false});
    };

    this.#filmComponent.shake(resetFilmCardState);
  };

  destroy = () => {
    remove(this.#filmComponent);
  };
}
