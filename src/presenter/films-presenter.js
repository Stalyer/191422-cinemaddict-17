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

  init = (filmsContainer) => {
    this.filmsContainer = filmsContainer;
    const filmsListMainComponent = new FilmsListView({typeSection: 'common', title: 'All movies. Upcoming', cardCount: FILMS_COUNT.main, showMore: true});
    const filmsListRatingComponent = new FilmsListView({typeSection: 'extra', title: 'Top rated', cardCount: FILMS_COUNT.rating, showMore: false});
    const filmsListCommentedComponent = new FilmsListView({typeSection: 'extra', title: 'Most commented', cardCount: FILMS_COUNT.commented, showMore: false});

    render(this.filmsComponent, this.filmsContainer);
    render(filmsListMainComponent, this.filmsComponent.getElement());
    render(filmsListRatingComponent, this.filmsComponent.getElement());
    render(filmsListCommentedComponent, this.filmsComponent.getElement());
  };
}
