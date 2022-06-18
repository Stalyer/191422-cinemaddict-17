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
  #commentCardView = new Map();

  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  #film = null;
  #comments = null;
  #isLoadingComments = true;

  constructor(filmListContainer, filmDetailsContainer, changeData, changeMode, filterModel, commentsModel) {
    this.#filmListContainer = filmListContainer;
    this.#filmDetailsContainer = filmDetailsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
  }

  get mode() {
    return this.#mode;
  }

  init = (film) => {
    this.#film = film;
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
      this.#comments = this.#commentsModel.comments;
      this.#filmDetailsComponent.updateElement(FilmDetailsView.convertFilmToState(this.#film, this.#comments.length));
      this.#renderFilmDetailComments();
      this.#filmDetailsComponent.scrollPosition = currerScrollPosition;
    }
  };

  #onModelEvent = (updateType) => {
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
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.MAJOR, {film: filmUpdate});
    } else {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.PATCH, {film: filmUpdate});
    }
  };

  #onWatchedClick = () => {
    const filmUpdate = {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched, watchingDate: !this.#film.userDetails.alreadyWatched ? new Date() : null }};
    if (this.#filterModel.filter !== FilterType.ALL && this.#filterModel.filter === FilterType.HISTORY) {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.MAJOR, {film: filmUpdate});
    } else {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.PATCH, {film: filmUpdate});
    }
  };

  #onFavoriteClick = () => {
    const filmUpdate = {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}};
    if (this.#filterModel.filter !== FilterType.ALL && this.#filterModel.filter === FilterType.FAVORITES) {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.MAJOR, {film: filmUpdate});
    } else {
      this.#changeData(UserAction.UPDATE_USER_LIST_FILM, UpdateType.PATCH, {film: filmUpdate});
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
    const newComment = {
      comment: comment,
      emotion: emotion ? emotion : 'smile',
    };
    this.#changeData(UserAction.ADD_COMMENT, UpdateType.PATCH, {film: this.#film, newComment: newComment});
  };

  #onDeleteCommentClick = (commentUpdate) => {
    this.#changeData(UserAction.DELETE_COMMENT, UpdateType.PATCH, {film: this.#film, commentUpdate: commentUpdate});
  };

  #renderFilmDetailComments = () => {
    if (this.#isLoadingComments) {
      return;
    }
    this.#commentCardView.clear();
    this.#comments.forEach((comment) => {
      const commentCardComponent = new CommentCardView(comment);
      commentCardComponent.setOnDeleteCommentClick(this.#onDeleteCommentClick);
      this.#commentCardView.set(comment.id, commentCardComponent);
      render(commentCardComponent, this.#filmDetailsComponent.commentsContainerNode);
    });
  };

  setDeletingComment = (commentId) => {
    if (this.#mode === Mode.DETAILS) {
      this.#commentCardView.get(commentId).updateElement({isDeleting: true});
    }
  };

  setDeletingCommentAborting = (commentId) => {
    if (this.#mode === Mode.DETAILS) {
      const resetCommentState = () => {
        this.#commentCardView.get(commentId).updateElement({isDeleting: false});
      };

      this.#commentCardView.get(commentId).shake(resetCommentState);
    }
  };

  setUpdateFilmCard = () => {
    if (this.#mode === Mode.DETAILS) {
      const currerScrollPosition = this.#filmDetailsComponent.scrollPosition;
      this.#filmDetailsComponent.updateElement({isDisabled: true});
      this.#renderFilmDetailComments();
      this.#filmDetailsComponent.scrollPosition = currerScrollPosition;
    }
  };

  setUpdateFilmCardAborting = () => {
    if (this.#mode === Mode.DETAILS) {
      const resetFilmCardState = () => {
        const currerScrollPosition = this.#filmDetailsComponent.scrollPosition;
        this.#filmDetailsComponent.updateElement({isDisabled: false});
        this.#renderFilmDetailComments();
        this.#filmDetailsComponent.scrollPosition = currerScrollPosition;
      };
      this.#filmDetailsComponent.shake(resetFilmCardState);
    }
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
