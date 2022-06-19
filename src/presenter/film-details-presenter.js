import {render, replace, remove} from '../framework/render.js';
import FilmDetailsView from '../view/film-details-view.js';
import CommentCardView from '../view/comment-card-view.js';
import {UserAction, UpdateType, FilterType} from '../const.js';

export default class FilmDetailsPresenter {
  #filmDetailsContainer = null;
  #filmDetailsComponent = null;
  #filterModel = null;
  #commentsModel = null;
  #commentCardView = new Map();

  #changeData = null;
  #changeMode = null;

  #film = null;
  #comments = null;
  #isLoadingComments = true;
  #currerScrollPosition = 0;

  constructor(filmDetailsContainer, changeData, changeMode, filterModel, commentsModel) {
    this.#filmDetailsContainer = filmDetailsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
  }

  get film() {
    return this.#film;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmDetailsComponent = this.#filmDetailsComponent;
    if (prevFilmDetailsComponent !== null) {
      this.#currerScrollPosition = prevFilmDetailsComponent.scrollPosition;
    }
    this.#filmDetailsComponent = new FilmDetailsView(this.#film, this.#film.comments.length);
    this.#filmDetailsContainer.classList.add('hide-overflow');
    this.#commentsModel.addObserver(this.#onModelEvent);
    this.#commentsModel.init(this.#film.id);


    this.#setFilmDetailsEvent();

    if (prevFilmDetailsComponent === null) {
      render(this.#filmDetailsComponent, this.#filmDetailsContainer);
      return;
    }

    replace(this.#filmDetailsComponent, prevFilmDetailsComponent);
    remove(prevFilmDetailsComponent);
  };

  #onModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT_COMMENTS:
        this.#isLoadingComments = false;
        this.#comments = this.#commentsModel.comments;
        this.#renderFilmDetailComments();
        this.#filmDetailsComponent.scrollPosition = this.#currerScrollPosition;
        break;
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

  #onCloseFilmDetails = () => {
    this.#filmDetailsContainer.classList.remove('hide-overflow');
    remove(this.#filmDetailsComponent);
    this.#changeMode();
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
    this.#commentCardView.get(commentId).updateElement({isDeleting: true});
  };

  setDeletingCommentAborting = (commentId) => {
    const resetCommentState = () => {
      this.#commentCardView.get(commentId).updateElement({isDeleting: false});
    };

    this.#commentCardView.get(commentId).shake(resetCommentState);
  };

  setUpdateFilmCard = () => {
    this.#currerScrollPosition = this.#filmDetailsComponent.scrollPosition;
    this.#filmDetailsComponent.updateElement({isDisabled: true});
    this.#renderFilmDetailComments();
    this.#filmDetailsComponent.scrollPosition = this.#currerScrollPosition;
  };

  setUpdateFilmCardAborting = (actionType) => {
    const shakeNode = actionType === UserAction.UPDATE_USER_LIST_FILM ? this.#filmDetailsComponent.controlsNode : this.#filmDetailsComponent.formNode;

    const resetFilmDetailsCardState = () => {
      this.#currerScrollPosition = this.#filmDetailsComponent.scrollPosition;
      this.#filmDetailsComponent.updateElement({isDisabled: false});
      this.#renderFilmDetailComments();
      this.#filmDetailsComponent.scrollPosition = this.#currerScrollPosition;
    };

    this.#filmDetailsComponent.shake(resetFilmDetailsCardState, shakeNode);
  };

  resetView = () => {
    this.#onCloseFilmDetails();
  };

  destroy = () => {
    remove(this.#filmDetailsComponent);
  };
}
