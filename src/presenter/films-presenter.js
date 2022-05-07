import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import {render} from '../render.js';

const FILMS_COUNT = {
  main: 5,
  rating: 2,
  commented: 2
};

export default class FilmsPresenter {
  filmsComponent = new FilmsView();

  init = (filmsContainer, filmsModel) => {
    this.filmsContainer = filmsContainer;
    this.filmsModel = filmsModel;
    this.filmsItems = [...this.filmsModel.getFilms()];

    const filmsListMainComponent = new FilmsListView({typeSection: 'common', title: 'All movies. Upcoming', filmsItems: this.filmsItems, cardCount: FILMS_COUNT.main, showMore: true});
    const filmsListRatingComponent = new FilmsListView({typeSection: 'extra', title: 'Top rated', filmsItems: this.filmsItems, cardCount: FILMS_COUNT.rating, showMore: false});
    const filmsListCommentedComponent = new FilmsListView({typeSection: 'extra', title: 'Most commented', filmsItems: this.filmsItems, cardCount: FILMS_COUNT.commented, showMore: false});

    render(this.filmsComponent, this.filmsContainer);
    render(filmsListMainComponent, this.filmsComponent.getElement());
    render(filmsListRatingComponent, this.filmsComponent.getElement());
    render(filmsListCommentedComponent, this.filmsComponent.getElement());
  };
}
