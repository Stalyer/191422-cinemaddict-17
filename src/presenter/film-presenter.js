import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import CommentCardView from '../view/comment-card-view.js';
import {UserAction, UpdateType, FilterType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  DETAILS: 'DETAILS',
};

export default class FilmPresenter {
  #filmListContainer = null;
  #filmDetailsContainer = null;
  #filmComponent = null;
  #filmDetailsComponent = null;
  #filterModel = null;

  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  #film = null;
  #comments = null;
  #someComments = null;

  constructor(filmListContainer, filmDetailsContainer, changeData, changeMode, filterModel) {
    this.#filmListContainer = filmListContainer;
    this.#filmDetailsContainer = filmDetailsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#filterModel = filterModel;
  }

  init = (film, comments) => {
    this.#film = film;
    this.#comments = comments;
    this.#someComments = this.#comments.filter((comment) => this.#film.comments.includes(comment.id));

    const prevFilmComponent = this.#filmComponent;
    this.#filmComponent = new FilmCardView(film);

    const openFilmDetails = () => {
      this.#changeMode();
      this.#mode = Mode.DETAILS;
      this.#filmDetailsComponent = new FilmDetailsView(this.#film, this.#someComments.length);
      this.#renderFilmDetailComments();
      this.#setFilmDetailsEvent();
      this.#filmDetailsContainer.classList.add('hide-overflow');
      render(this.#filmDetailsComponent, this.#filmDetailsContainer);
    };

    this.#filmComponent.setOnLinkClick(openFilmDetails);
    this.#filmComponent.setOnWatchlistClick(this.#onWatchlistClick);
    this.#filmComponent.setOnWatchedClick(this.#onWatchedClick);
    this.#filmComponent.setOnFavoriteClick(this.#onFavoriteClick);

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#filmListContainer);
      return;
    }

    replace(this.#filmComponent, prevFilmComponent);
    remove(prevFilmComponent);

    if (this.#mode === Mode.DETAILS) {
      const currerScrollPosition = this.#filmDetailsComponent.scrollPosition;
      this.#filmDetailsComponent.update(this.#film, this.#someComments.length);
      this.#filmDetailsComponent.scrollPosition = currerScrollPosition;
    }
  };

  #onWatchlistClick = () => {
    const filmUpdate = {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}};
    if (this.#filterModel.filter !== FilterType.ALL && this.#filterModel.filter === FilterType.WATCHLIST) {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.MAJOR, filmUpdate);
    } else {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.PATCH, filmUpdate);
    }
  };

  #onWatchedClick = () => {
    const filmUpdate = {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}};
    if (this.#filterModel.filter !== FilterType.ALL && this.#filterModel.filter === FilterType.HISTORY) {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.MAJOR, filmUpdate);
    } else {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.PATCH, filmUpdate);
    }
  };

  #onFavoriteClick = () => {
    const filmUpdate = {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}};
    if (this.#filterModel.filter !== FilterType.ALL && this.#filterModel.filter === FilterType.FAVORITES) {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.MAJOR, filmUpdate);
    } else {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.PATCH, filmUpdate);
    }
  };

  #setFilmDetailsEvent = () => {
    this.#filmDetailsComponent.setOnCloseBtnClick(this.#onCloseFilmDetails);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#filmDetailsComponent.setOnWatchlistClick(this.#onWatchlistClick);
    this.#filmDetailsComponent.setOnWatchedClick(this.#onWatchedClick);
    this.#filmDetailsComponent.setOnFavoriteClick(this.#onFavoriteClick);
    this.#filmDetailsComponent.setOnNewCommentSend(this.#onSendNewComment);
    this.#filmDetailsComponent.setOnRenderComment(this.#renderFilmDetailComments);
  };

  #onCloseFilmDetails = () => {
    this.#filmDetailsContainer.classList.remove('hide-overflow');
    remove(this.#filmDetailsComponent);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#onCloseFilmDetails();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #onSendNewComment = ({comment, emotion}) => {
    const lastComment = this.#comments[this.#comments.length - 1];
    const idNewComment = lastComment.id + 1;
    const newComment = {
      id: idNewComment,
      author: 'User',
      comment: comment,
      emotion: emotion ? emotion : 'smile',
    };
    const filmUpdate = {...this.#film, comments: [...this.#film.comments, idNewComment]};
    this.#changeData(UserAction.ADD_COMMENT, UpdateType.PATCH, filmUpdate, newComment);
  };

  #onDeleteCommentClick = (commentUpdate) => {
    const index = this.#film.comments.findIndex((id) => id === commentUpdate.id);
    const filmCommentIds = this.#film.comments.slice();
    filmCommentIds.splice(index, 1);
    const filmUpdate = {...this.#film, comments: filmCommentIds};
    this.#changeData(UserAction.DELETE_COMMENT, UpdateType.PATCH, filmUpdate, commentUpdate);
  };

  #renderFilmDetailComments = () => {
    this.#someComments.forEach((comment) => {
      const commentCardComponent = new CommentCardView(comment);
      commentCardComponent.setOnDeleteCommentClick(this.#onDeleteCommentClick);
      render(commentCardComponent, this.#filmDetailsComponent.commentsContainerNode);
    });
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#onCloseFilmDetails();
    }
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmDetailsComponent);
  };
}
