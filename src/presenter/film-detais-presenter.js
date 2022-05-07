import FilmDetailsView from '../view/film-details-view.js';
import {render} from '../render.js';

export default class FilmsPresenter {
  init = (filmContainer, filmsModel) => {
    this.filmContainer = filmContainer;
    this.filmsModel = filmsModel;
    this.filmsItems = [...this.filmsModel.getFilms()];
    this.commentsItems = [...this.filmsModel.getComments()];

    const filmDetailsComponent = new FilmDetailsView(this.filmsItems[0], this.commentsItems);

    render(filmDetailsComponent, this.filmContainer);
  };
}
