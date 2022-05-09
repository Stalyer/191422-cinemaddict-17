import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import {render} from '../render.js';

const FILMS_COUNT = {
  main: 5,
  rating: 2,
  commented: 2
};

// const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmDetailsContainer = null;
  #filmsModel = null;
  #filmsComponent = new FilmsView();
  #filmsListMainComponent = null;
  #filmsListRatingComponent = null;
  #filmsListCommentedComponent = null;
  #filmsItems = [];
  #commentsItems = [];

  init = (filmsContainer, filmDetailsContainer, filmsModel) => {
    this.#filmsContainer = filmsContainer;
    this.#filmDetailsContainer = filmDetailsContainer;
    this.#filmsModel = filmsModel;
    this.#filmsItems = [...this.#filmsModel.films];
    this.#commentsItems = [...this.#filmsModel.comments];

    this.#filmsListMainComponent = new FilmsListView({typeSection: 'common', title: 'All movies. Upcoming', showMore: true});
    this.#filmsListRatingComponent = new FilmsListView({typeSection: 'extra', title: 'Top rated', showMore: false});
    this.#filmsListCommentedComponent = new FilmsListView({typeSection: 'extra', title: 'Most commented', showMore: false});

    this.#addFilmsCards(this.#filmsListMainComponent, FILMS_COUNT.main);
    this.#addFilmsCards(this.#filmsListRatingComponent, FILMS_COUNT.rating);
    this.#addFilmsCards(this.#filmsListCommentedComponent, FILMS_COUNT.commented);

    render(this.#filmsComponent, this.#filmsContainer);
    render(this.#filmsListMainComponent, this.#filmsComponent.element);
    render(this.#filmsListRatingComponent, this.#filmsComponent.element);
    render(this.#filmsListCommentedComponent, this.#filmsComponent.element);
  };

  #addFilmsCards = (filmsList, cardCount) => {
    for (let i = 0; i < cardCount; i++) {
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
      openFilmDetails();
    });

    render(filmComponent, container);
  };

  #renderFilmDetails = (film, comments) => {
    const filmDetailsComponent = new FilmDetailsView(film, comments);
    this.#filmDetailsContainer.classList.add('hide-overflow');

    const closeFilmDetails = () => {
      this.#filmDetailsContainer.removeChild(filmDetailsComponent.element);
      this.#filmDetailsContainer.classList.remove('hide-overflow');
      filmDetailsComponent.removeElement();
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closeFilmDetails();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    filmDetailsComponent.closeBtnNode.addEventListener('click', () => {
      closeFilmDetails();
    });

    document.addEventListener('keydown', onEscKeyDown);

    render(filmDetailsComponent, this.#filmDetailsContainer);
  };
}
