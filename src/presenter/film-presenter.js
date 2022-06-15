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
  #commentsModel = null;

  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  #film = null;
  #comments = null;
  #isLoadingComments = true;
  // #someComments = null;

  constructor(filmListContainer, filmDetailsContainer, changeData, changeMode, filterModel, commentsModel) {
    this.#filmListContainer = filmListContainer;
    this.#filmDetailsContainer = filmDetailsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
  }

  init = (film) => {
    this.#film = film;

    // this.#someComments = this.#comments.filter((comment) => this.#film.comments.includes(comment.id));

    const prevFilmComponent = this.#filmComponent;
    this.#filmComponent = new FilmCardView(film);
    const openFilmDetails = () => {
      this.#changeMode();
      this.#mode = Mode.DETAILS;

      this.#filmDetailsComponent = new FilmDetailsView(this.#film, this.#film.comments.length);
      this.#commentsModel.addObserver(this.#onModelEvent);
      this.#commentsModel.init(this.#film.id);

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
      // this.#comments = this.#commentsModel.getFilmComments(this.#film.id);
      this.#filmDetailsComponent.update(this.#film, this.#comments.length);
      this.#filmDetailsComponent.scrollPosition = currerScrollPosition;
    }
  };

  #onModelEvent = (updateType) => {
    // console.log('comment ', updateType, data);
    switch (updateType) {
      case UpdateType.INIT_COMMENTS:
        this.#isLoadingComments = false;
        this.#comments = this.#commentsModel.comments;
        this.#renderFilmDetailComments();
        break;
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
    const filmUpdate = {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched, watchingDate: !this.#film.userDetails.alreadyWatched ? new Date() : null }};
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
    // const lastComment = this.#comments[this.#comments.length - 1];
    // const idNewComment = lastComment.id + 1;
    const newComment = {
      filmId: this.#film.id,
      comment: comment,
      emotion: emotion ? emotion : 'smile',
    };
    // const filmUpdate = {...this.#film, comments: [...this.#film.comments, idNewComment]};
    this.#changeData(UserAction.ADD_COMMENT, UpdateType.PATCH, newComment);
  };

  #onDeleteCommentClick = (commentUpdate) => {
    // const index = this.#film.comments.findIndex((id) => id === commentUpdate.id);
    // const filmCommentIds = this.#film.comments.slice();
    // filmCommentIds.splice(index, 1);
    // const filmUpdate = {...this.#film, comments: filmCommentIds};
    this.#changeData(UserAction.DELETE_COMMENT, UpdateType.PATCH, commentUpdate);
  };

  #renderFilmDetailComments = () => {
    // if (this.#isLoadingComments) {
    //   return;
    // }

    this.#comments.forEach((comment) => {
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
