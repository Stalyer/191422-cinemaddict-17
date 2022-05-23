import {render, RenderPosition, remove} from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import ShowMoreView from '../view/show-more-view.js';
import SortView from '../view/sort-view.js';
import FilmPresenter from './film-presenter.js';
import {updateItem} from '../utils/common.js';

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
  #filmsComponent = new FilmsView();
  #filmsListMainComponent = null;
  #filmsListRatingComponent = null;
  #filmsListCommentedComponent = null;
  #filmsListEmptyComponent = null;
  #showMoreViewComponent = new ShowMoreView();
  #SortViewComponent = new SortView();
  #filmsItems = [];
  #commentsItems = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();

  constructor(filmsContainer, filmDetailsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmDetailsContainer = filmDetailsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#filmsItems = [...this.#filmsModel.films];
    this.#commentsItems = [...this.#filmsModel.comments];

    this.#renderFilmsContainer();
  };

  #renderFilms = (filmsList, from, to) => {
    this.#filmsItems.slice(from, to).forEach((film) => this.#renderFilm(film, filmsList.containerNode));
  };

  #renderFilm = (film, container) => {
    if (this.#filmPresenter.has(film.id)) {
      return;
    }

    const filmPresenter = new FilmPresenter(container, this.#filmDetailsContainer, this.#onFilmChange, this.#onModeChange);
    filmPresenter.init(film, this.#commentsItems);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #onShowMoreButtonClick = () => {
    this.#renderFilms(this.#filmsListMainComponent, this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;
    if (this.#renderedFilmCount >= this.#filmsItems.length) {
      remove(this.#showMoreViewComponent);
    }
  };

  #onModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };

  #onFilmChange = (updatedFilm) => {
    this.#filmsItems = updateItem(this.#filmsItems, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm, this.#commentsItems);
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreViewComponent, this.#filmsListMainComponent.element);
    this.#showMoreViewComponent.setOnClick(this.#onShowMoreButtonClick);
  };

  #renderSort = () => {
    render(this.#SortViewComponent, this.#filmsComponent.element, RenderPosition.BEFOREBEGIN);
  };

  #renderFilmsMainList = () => {
    this.#filmsListMainComponent = new FilmsListView({typeSection: 'common', title: 'All movies. Upcoming'});

    this.#renderFilms(this.#filmsListMainComponent, 0, Math.min(this.#filmsItems.length, FILMS_COUNT.main));

    if (this.#filmsItems.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }

    render(this.#filmsListMainComponent, this.#filmsComponent.element);
  };

  #renderFilmsExtraList = () => {
    this.#filmsListRatingComponent = new FilmsListView({typeSection: 'extra', title: 'Top rated'});
    this.#filmsListCommentedComponent = new FilmsListView({typeSection: 'extra', title: 'Most commented'});

    this.#renderFilms(this.#filmsListRatingComponent, 0, Math.min(this.#filmsItems.length, FILMS_COUNT.rating));
    this.#renderFilms(this.#filmsListCommentedComponent, 0, Math.min(this.#filmsItems.length, FILMS_COUNT.commented));

    render(this.#filmsListRatingComponent, this.#filmsComponent.element);
    render(this.#filmsListCommentedComponent, this.#filmsComponent.element);
  };

  #renderFilmsContainer = () => {
    render(this.#filmsComponent, this.#filmsContainer);

    if (!this.#filmsItems.length) {
      this.#filmsListEmptyComponent = new FilmsListView({typeSection: 'empty', title: 'There are no movies in our database'});
      this.#filmsListEmptyComponent.containerNode.remove();
      render(this.#filmsListEmptyComponent, this.#filmsComponent.element);
      return;
    }

    this.#renderSort();
    this.#renderFilmsMainList();
    this.#renderFilmsExtraList();
  };

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreViewComponent);
  };
}
