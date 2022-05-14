import {render, remove} from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import ShowMoreView from '../view/show-more-view.js';
import SortView from '../view/sort-view.js';

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
  #filmDetailsComponent = null;
  #showMoreViewComponent = new ShowMoreView();
  #SortViewComponent = new SortView();
  #filmsItems = [];
  #commentsItems = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  init = (filmsContainer, filmDetailsContainer, filmsModel) => {
    this.#filmsContainer = filmsContainer;
    this.#filmDetailsContainer = filmDetailsContainer;
    this.#filmsModel = filmsModel;
    this.#filmsItems = [...this.#filmsModel.films];
    this.#commentsItems = [...this.#filmsModel.comments];

    if (this.#filmsItems.length) {
      this.#filmsListMainComponent = new FilmsListView({typeSection: 'common', title: 'All movies. Upcoming'});
      this.#filmsListRatingComponent = new FilmsListView({typeSection: 'extra', title: 'Top rated'});
      this.#filmsListCommentedComponent = new FilmsListView({typeSection: 'extra', title: 'Most commented'});

      this.#addFilmsCards(this.#filmsListMainComponent, FILMS_COUNT.main);
      this.#addFilmsCards(this.#filmsListRatingComponent, FILMS_COUNT.rating);
      this.#addFilmsCards(this.#filmsListCommentedComponent, FILMS_COUNT.commented);

      if (this.#filmsItems.length > FILM_COUNT_PER_STEP) {
        render(this.#showMoreViewComponent, this.#filmsListMainComponent.element);
        this.#showMoreViewComponent.setOnClick(this.#onShowMoreButtonClick);
      }

      render(this.#SortViewComponent, this.#filmsContainer);
      render(this.#filmsComponent, this.#filmsContainer);
      render(this.#filmsListMainComponent, this.#filmsComponent.element);
      render(this.#filmsListRatingComponent, this.#filmsComponent.element);
      render(this.#filmsListCommentedComponent, this.#filmsComponent.element);
    } else {
      this.#filmsListEmptyComponent = new FilmsListView({typeSection: 'empty', title: 'There are no movies in our database'});
      this.#filmsListEmptyComponent.containerNode.remove();
      render(this.#filmsComponent, this.#filmsContainer);
      render(this.#filmsListEmptyComponent, this.#filmsComponent.element);
    }
  };

  #addFilmsCards = (filmsList, cardCount) => {
    for (let i = 0; i < Math.min(cardCount, FILM_COUNT_PER_STEP); i++) {
      if (this.#filmsItems[i]) {
        this.#renderFilm(this.#filmsItems[i], filmsList.containerNode);
      } else {
        break;
      }
    }
  };

  #renderFilm = (film, container) => {
    const filmComponent = new FilmCardView(film);

    const openFilmDetails = () => {
      this.#renderFilmDetails(film, this.#commentsItems);
    };

    filmComponent.linkNode.addEventListener('click', () => {
      if(this.#filmDetailsComponent) {
        document.removeEventListener('keydown', this.#onEscKeyDown);
        remove(this.#filmDetailsComponent);
      }
      openFilmDetails();
    });

    render(filmComponent, container);
  };

  #renderFilmDetails = (film, comments) => {
    this.#filmDetailsComponent = new FilmDetailsView(film, comments);
    this.#filmDetailsContainer.classList.add('hide-overflow');

    this.#filmDetailsComponent.setOnClickCloseBtn(this.#onCloseFilmDetails);
    document.addEventListener('keydown', this.#onEscKeyDown);

    render(this.#filmDetailsComponent, this.#filmDetailsContainer);
  };

  #onCloseFilmDetails = () => {
    this.#filmDetailsContainer.classList.remove('hide-overflow');
    remove(this.#filmDetailsComponent);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#onCloseFilmDetails();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #onShowMoreButtonClick = () => {
    this.#filmsItems.slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP).forEach((film) => this.#renderFilm(film, this.#filmsListMainComponent.containerNode));
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;
    if (this.#renderedFilmCount >= this.#filmsItems.length) {
      remove(this.#showMoreViewComponent);
    }
  };
}
