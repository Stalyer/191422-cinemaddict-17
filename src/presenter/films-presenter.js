import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import {render} from '../render.js';

const FILMS_COUNT = {
  main: 5,
  rating: 2,
  commented: 2
};

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #filmsComponent = new FilmsView();
  #filmsListMainComponent = null;
  #filmsListRatingComponent = null;
  #filmsListCommentedComponent = null;
  #filmsItems = [];

  init = (filmsContainer, filmsModel) => {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#filmsItems = [...this.#filmsModel.films];

    this.#filmsListMainComponent = new FilmsListView({typeSection: 'common', title: 'All movies. Upcoming', filmsItems: this.#filmsItems, cardCount: FILMS_COUNT.main, showMore: true});
    this.#filmsListRatingComponent = new FilmsListView({typeSection: 'extra', title: 'Top rated', filmsItems: this.#filmsItems, cardCount: FILMS_COUNT.rating, showMore: false});
    this.#filmsListCommentedComponent = new FilmsListView({typeSection: 'extra', title: 'Most commented', filmsItems: this.#filmsItems, cardCount: FILMS_COUNT.commented, showMore: false});

    render(this.#filmsComponent, this.#filmsContainer);
    render(this.#filmsListMainComponent, this.#filmsComponent.element);
    render(this.#filmsListRatingComponent, this.#filmsComponent.element);
    render(this.#filmsListCommentedComponent, this.#filmsComponent.element);
  };
}
