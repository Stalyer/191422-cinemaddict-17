import {render, RenderPosition, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import ProfileView from '../view/profile-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import ShowMoreView from '../view/show-more-view.js';
import SortView from '../view/sort-view.js';
import FilmPresenter from './film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';
import {SortType, UserAction, UpdateType, FilterType} from '../const.js';
import {sortFilmDate, sortFilmCommented, sortFilmRated} from '../utils/film.js';
import {filter} from '../utils/filter.js';

const FILMS_COUNT = {
  main: 5,
  rating: 2,
  commented: 2
};

const FILM_COUNT_PER_STEP = 5;

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class FilmsPresenter {
  #headerContainer = null;
  #filmsContainer = null;
  #filmDetailsContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #profileComponent = null;
  #filmsComponent = new FilmsView();
  #filmsListMainComponent = null;
  #filmsListRatedComponent = null;
  #filmsListCommentedComponent = null;
  #filmsListEmptyComponent = null;
  #loadingComponent = new FilmsListView({typeSection: 'empty', title: 'Loading...'});
  #showMoreComponent = null;
  #sortComponent = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmMainPresenter = new Map();
  #filmRatedPresenter = new Map();
  #filmCommentedPresenter = new Map();
  #filmDetailsPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  #isRerenderListCommented = false;

  constructor(headerContainer, filmsContainer, filmDetailsContainer, filmsModel, commentsModel, filterModel) {
    this.#headerContainer = headerContainer;
    this.#filmsContainer = filmsContainer;
    this.#filmDetailsContainer = filmDetailsContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#onModelEvent);
    this.#commentsModel.addObserver(this.#onModelCommentEvent);
    this.#filterModel.addObserver(this.#onModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films.slice();
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmRated);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderFilmsContainer();
  };

  #renderFilms = (filmsItems, filmsList, presenter) => {
    filmsItems.forEach((film) => this.#renderFilm(film, filmsList.containerNode, presenter));
  };

  #renderFilm = (film, container, presenter) => {
    const filmPresenter = new FilmPresenter(container, this.#onViewAction, this.#onModeChangeCard, this.#filterModel);
    filmPresenter.init(film);
    presenter.set(film.id, filmPresenter);
  };

  #renderFilmDetails = (film) => {
    this.#filmDetailsPresenter = new FilmDetailsPresenter(this.#filmDetailsContainer, this.#onViewAction, this.#onModeChangeDetailsCard, this.#filterModel, this.#commentsModel);
    this.#filmDetailsPresenter.init(film);
  };

  #renderShowMoreButton = () => {
    this.#showMoreComponent = new ShowMoreView();
    this.#showMoreComponent.setOnShowMoreClick(this.#onShowMoreButtonClick);
    render(this.#showMoreComponent, this.#filmsListMainComponent.element);
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearFilmsContainer({resetRenderedFilmCount: true});
    this.#renderFilmsContainer();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setOnSortTypeChange(this.#onSortTypeChange);
    render(this.#sortComponent, this.#filmsComponent.element, RenderPosition.BEFOREBEGIN);
  };

  #renderFilmsMainList = (films, filmCount) => {
    this.#filmsListMainComponent = new FilmsListView({typeSection: 'common', title: 'All movies. Upcoming'});

    this.#renderFilms(films.slice(0, Math.min(films.length, FILMS_COUNT.main)), this.#filmsListMainComponent, this.#filmMainPresenter);

    if (filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }

    render(this.#filmsListMainComponent, this.#filmsComponent.element);
  };

  #renderFilmsRatedList = (films) => {
    const filmsRatedItems = films.slice(0, films.length).sort(sortFilmRated);

    if (!filmsRatedItems[0]['filmInfo']['totalRating']) {
      return;
    }

    this.#filmsListRatedComponent = new FilmsListView({typeSection: 'extra', title: 'Top rated'});
    this.#renderFilms(filmsRatedItems.slice(0, Math.min(filmsRatedItems.length, FILMS_COUNT.rating)), this.#filmsListRatedComponent, this.#filmRatedPresenter);
    render(this.#filmsListRatedComponent, this.#filmsComponent.element);
  };

  #renderFilmsCommentedList = (films) => {
    const filmsCommentedItems = films.slice(0, films.length).sort(sortFilmCommented);

    if (!filmsCommentedItems[0]['comments'].length) {
      return;
    }

    if (this.#isRerenderListCommented) {
      this.#filmCommentedPresenter.forEach((presenter) => presenter.destroy());
      this.#filmCommentedPresenter.clear();
      remove(this.#filmsListCommentedComponent);
      this.#isRerenderListCommented = false;
    }

    this.#filmsListCommentedComponent = new FilmsListView({typeSection: 'extra', title: 'Most commented'});
    this.#renderFilms(filmsCommentedItems.slice(0, Math.min(filmsCommentedItems.length, FILMS_COUNT.commented)), this.#filmsListCommentedComponent, this.#filmCommentedPresenter);
    render(this.#filmsListCommentedComponent, this.#filmsComponent.element);
  };

  #renderFilmsContainer = () => {
    render(this.#filmsComponent, this.#filmsContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const films = this.films;
    const filmCount = films.length;
    const filmsAll = this.#filmsModel.films;

    if (filmCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderProfile();
    this.#renderSort();
    this.#renderFilmsMainList(films, filmCount);
    this.#renderFilmsRatedList(filmsAll);
    this.#renderFilmsCommentedList(filmsAll);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsComponent.element);
  };

  #renderNoFilms = () => {
    const NoTFilmsTextType = {
      [FilterType.ALL]: 'There are no movies in our database',
      [FilterType.WATCHLIST]: 'There are no movies to watch now',
      [FilterType.HISTORY]: 'There are no watched movies now',
      [FilterType.FAVORITES]: 'There are no favorite movies now',
    };

    this.#filmsListEmptyComponent = new FilmsListView({typeSection: 'empty', title: NoTFilmsTextType[this.#filterType]});
    render(this.#filmsListEmptyComponent, this.#filmsComponent.element);
  };

  #renderProfile = () => {
    const watchedFilms = filter[FilterType.HISTORY](this.#filmsModel.films);
    this.#profileComponent = new ProfileView(watchedFilms.length);
    render(this.#profileComponent, this.#headerContainer);
  };

  #clearFilmsContainer = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmMainPresenter.forEach((presenter) => presenter.destroy());
    this.#filmMainPresenter.clear();

    this.#filmRatedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmRatedPresenter.clear();

    this.#filmCommentedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCommentedPresenter.clear();

    remove(this.#profileComponent);
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#showMoreComponent);
    remove(this.#filmsListMainComponent);
    remove(this.#filmsListRatedComponent);
    remove(this.#filmsListCommentedComponent);

    if (this.#filmsListEmptyComponent) {
      remove(this.#filmsListEmptyComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #getFilmFromPresenters = (filmId) => {
    const filmPresentersFound = [];

    const filmMainPresenterFound = this.#filmMainPresenter.get(filmId);
    const filmRatedPresenterFound = this.#filmRatedPresenter.get(filmId);
    const filmCommentedPresenterFound = this.#filmCommentedPresenter.get(filmId);

    if (filmMainPresenterFound) {
      filmPresentersFound.push(filmMainPresenterFound);
    }

    if (filmRatedPresenterFound) {
      filmPresentersFound.push(filmRatedPresenterFound);
    }

    if (filmCommentedPresenterFound) {
      filmPresentersFound.push(filmCommentedPresenterFound);
    }

    return filmPresentersFound;
  };

  #onShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films, this.#filmsListMainComponent, this.#filmMainPresenter);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.films.length) {
      remove(this.#showMoreComponent);
    }
  };

  #onModeChangeCard = (film) => {
    if (this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter.resetView();
    }
    this.#renderFilmDetails(film);
  };

  #onModeChangeDetailsCard = () => {
    this.#filmDetailsPresenter = null;
  };

  #onViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    const filmPresentersFound = this.#getFilmFromPresenters(update.film.id);
    switch (actionType) {
      case UserAction.UPDATE_USER_LIST_FILM: {
        filmPresentersFound.forEach((presenter) => presenter.setUpdateFilmCard());
        if (this.#filmDetailsPresenter) {
          this.#filmDetailsPresenter.setUpdateFilmCard();
        }
        try {
          await this.#filmsModel.updateFilm(updateType, update.film);
        } catch(err) {
          filmPresentersFound.forEach((presenter) => presenter.setUpdateFilmCardAborting());
          if (this.#filmDetailsPresenter) {
            this.#filmDetailsPresenter.setUpdateFilmCardAborting(UserAction.UPDATE_USER_LIST_FILM);
          }
        }
        break;
      }
      case UserAction.ADD_COMMENT: {
        this.#filmDetailsPresenter.setUpdateFilmCard(UserAction.ADD_COMMENT);
        try {
          await this.#commentsModel.addComment(updateType, update);
        } catch(err) {
          this.#filmDetailsPresenter.setUpdateFilmCardAborting(UserAction.ADD_COMMENT);
        }
        break;
      }
      case UserAction.DELETE_COMMENT: {
        this.#filmDetailsPresenter.setDeletingComment(update.commentUpdate.id);
        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch(err) {
          this.#filmDetailsPresenter.setDeletingCommentAborting(update.commentUpdate.id);
        }
        break;
      }
    }

    this.#uiBlocker.unblock();
  };

  #onModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH: {
        this.#getFilmFromPresenters(data.id).forEach((presenter) => presenter.init(data));
        if (this.#filmDetailsPresenter) {
          if (this.#filmDetailsPresenter.film.id === data.id) {
            this.#filmDetailsPresenter.init(data);
          }
        }
        break;
      }
      case UpdateType.MINOR:
        this.#clearFilmsContainer();
        this.#renderFilmsContainer();
        if (this.#filmDetailsPresenter) {
          if (this.#filmDetailsPresenter.film.id === data.id) {
            this.#filmDetailsPresenter.init(data);
          }
        }
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsContainer({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmsContainer();
        if (this.#filmDetailsPresenter) {
          if (this.#filmDetailsPresenter.film.id === data.id) {
            this.#filmDetailsPresenter.init(data);
          }
        }
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearFilmsContainer();
        this.#renderFilmsContainer();
        break;
    }
  };

  #onModelCommentEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmsModel.updateLocalFilm(updateType, data);
        this.#isRerenderListCommented = true;
        this.#renderFilmsCommentedList(this.#filmsModel.films);
        break;
    }
  };
}
