import {render, RenderPosition, remove} from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import ShowMoreView from '../view/show-more-view.js';
import SortView from '../view/sort-view.js';
import FilmPresenter from './film-presenter.js';
import {SortType, UserAction, UpdateType, FilterType} from '../const.js';
import {sortFilmDate, sortFilmCommented, sortFilmRated} from '../utils/film.js';
import {filter} from '../utils/filter.js';

const FILMS_COUNT = {
  main: 5,
  rating: 2,
  commented: 2
};

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmDetailsContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #filmsComponent = new FilmsView();
  #filmsListMainComponent = null;
  #filmsListRatedComponent = null;
  #filmsListCommentedComponent = null;
  #filmsListEmptyComponent = null;
  #showMoreComponent = null;
  #sortComponent = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmMainPresenter = new Map();
  #filmRatedPresenter = new Map();
  #filmCommentedPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor(filmsContainer, filmDetailsContainer, filmsModel, commentsModel, filterModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmDetailsContainer = filmDetailsContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#onModelEvent);
    // this.#commentsModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmRated);
    }

    return filteredFilms;
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = () => {
    this.#renderFilmsContainer();
  };

  #renderFilms = (filmsItems, filmsList, presenter) => {
    filmsItems.forEach((film) => this.#renderFilm(film, filmsList.containerNode, presenter));
  };

  #renderFilm = (film, container, presenter) => {
    const filmPresenter = new FilmPresenter(container, this.#filmDetailsContainer, this.#onViewAction, this.#onModeChange, this.#filterModel);
    filmPresenter.init(film, this.comments);
    presenter.set(film.id, filmPresenter);
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

  #onModeChange = () => {
    this.#filmMainPresenter.forEach((presenter) => presenter.resetView());
    this.#filmRatedPresenter.forEach((presenter) => presenter.resetView());
    this.#filmCommentedPresenter.forEach((presenter) => presenter.resetView());
  };

  #onViewAction = (actionType, updateType, updateFilm, updateComment = false) => {
    switch (actionType) {
      case UserAction.UPDATE_USER_LIST_FILM:
        this.#filmsModel.updateFilm(updateType, updateFilm);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, updateComment);
        this.#filmsModel.updateFilm(updateType, updateFilm);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, updateComment);
        this.#filmsModel.updateFilm(updateType, updateFilm);
        break;
    }
  };

  #onModelEvent = (updateType, data) => {
    const filmMainPresenterFound = this.#filmMainPresenter.get(data.id);
    const filmRatedPresenterFound = this.#filmRatedPresenter.get(data.id);
    const filmCommentedPresenterFound = this.#filmCommentedPresenter.get(data.id);
    switch (updateType) {
      case UpdateType.PATCH:
        if (filmMainPresenterFound) {
          filmMainPresenterFound.init(data, this.comments);
        }

        if (filmRatedPresenterFound) {
          filmRatedPresenterFound.init(data, this.comments);
        }

        if (filmCommentedPresenterFound) {
          filmCommentedPresenterFound.init(data, this.comments);
        }
        break;
      case UpdateType.MINOR:
        this.#clearFilmsContainer();
        this.#renderFilmsContainer();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsContainer({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmsContainer();
        break;
    }
  };

  #renderShowMoreButton = () => {
    this.#showMoreComponent = new ShowMoreView();
    this.#showMoreComponent.setOnClick(this.#onShowMoreButtonClick);
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

  #renderFilmsExtraList = (films) => {
    this.#filmsListRatedComponent = new FilmsListView({typeSection: 'extra', title: 'Top rated'});
    this.#filmsListCommentedComponent = new FilmsListView({typeSection: 'extra', title: 'Most commented'});

    const filmsRatedItems = films.slice(0, films.length).sort(sortFilmRated);
    const filmsCommentedItems = films.slice(0, films.length).sort(sortFilmCommented);

    this.#renderFilms(filmsRatedItems.slice(0, Math.min(filmsRatedItems.length, FILMS_COUNT.rating)), this.#filmsListRatedComponent, this.#filmRatedPresenter);
    this.#renderFilms(filmsCommentedItems.slice(0, Math.min(filmsCommentedItems.length, FILMS_COUNT.commented)), this.#filmsListCommentedComponent, this.#filmCommentedPresenter);

    render(this.#filmsListRatedComponent, this.#filmsComponent.element);
    render(this.#filmsListCommentedComponent, this.#filmsComponent.element);
  };

  #renderFilmsContainer = () => {
    const films = this.films;
    const filmCount = films.length;
    const filmsAll = this.#filmsModel.films;

    render(this.#filmsComponent, this.#filmsContainer);

    if (filmCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmsMainList(films, filmCount);
    this.#renderFilmsExtraList(filmsAll);
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

  #clearFilmsContainer = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmMainPresenter.forEach((presenter) => presenter.destroy());
    this.#filmMainPresenter.clear();

    this.#filmRatedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmRatedPresenter.clear();

    this.#filmCommentedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCommentedPresenter.clear();

    remove(this.#sortComponent);
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
}
