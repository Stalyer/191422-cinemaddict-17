import ProfileView from './view/profile-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import SortView from './view/sort-view.js';
import StatisticsView from './view/statistics-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import {render} from './render.js';

const siteHeaderNode = document.querySelector('.header');
const siteMainNode = document.querySelector('.main');
const siteFooterNode = document.querySelector('.footer');
const footerStatisticsNode = siteFooterNode.querySelector('.footer__statistics');
const filmsPresenter = new FilmsPresenter();

render(new ProfileView, siteHeaderNode);
render(new MainNavigationView, siteMainNode);
render(new SortView, siteMainNode);
filmsPresenter.init(siteMainNode);
render(new StatisticsView, footerStatisticsNode);
