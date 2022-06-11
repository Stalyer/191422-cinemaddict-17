import {render} from './framework/render.js';
import ProfileView from './view/profile-view.js';
import StatisticsView from './view/statistics-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';

const siteBodyNode = document.querySelector('body');
const siteHeaderNode = siteBodyNode.querySelector('.header');
const siteMainNode = siteBodyNode.querySelector('.main');
const siteFooterNode = siteBodyNode.querySelector('.footer');
const footerStatisticsNode = siteFooterNode.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(siteMainNode, siteBodyNode, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainNode, filterModel, filmsModel);

render(new ProfileView, siteHeaderNode);
filterPresenter.init();
filmsPresenter.init();
render(new StatisticsView(filmsModel.films.length), footerStatisticsNode);
