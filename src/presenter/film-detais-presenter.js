import FilmDetailsView from '../view/film-details-view.js';
import {render} from '../render.js';

export default class FilmsPresenter {
  #filmContainer = null;
  #filmsModel = null;
  #filmDetailsComponent = null;
  #filmsItems = [];
  #commentsItems = [];

  init = (filmContainer, filmsModel) => {
    this.#filmContainer = filmContainer;
    this.#filmsModel = filmsModel;
    this.#filmsItems = [...this.#filmsModel.films];
    this.#commentsItems = [...this.#filmsModel.comments];

    this.#filmDetailsComponent = new FilmDetailsView(this.#filmsItems[0], this.#commentsItems);

    render(this.#filmDetailsComponent, this.#filmContainer);
  };
}
