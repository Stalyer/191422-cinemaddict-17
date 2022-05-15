import {render} from './framework/render.js';
import ProfileView from './view/profile-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import StatisticsView from './view/statistics-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import {generateFilter} from './mock/filter.js';

const siteBodyNode = document.querySelector('body');
const siteHeaderNode = siteBodyNode.querySelector('.header');
const siteMainNode = siteBodyNode.querySelector('.main');
const siteFooterNode = siteBodyNode.querySelector('.footer');
const footerStatisticsNode = siteFooterNode.querySelector('.footer__statistics');

const filmsPresenter = new FilmsPresenter();
const filmsModel = new FilmsModel();
const filters = generateFilter(filmsModel.films);

render(new ProfileView, siteHeaderNode);
render(new MainNavigationView(filters), siteMainNode);
filmsPresenter.init(siteMainNode, siteBodyNode, filmsModel);
render(new StatisticsView(filmsModel.films.length), footerStatisticsNode);
