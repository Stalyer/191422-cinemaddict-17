import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import he from 'he';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const createCommentTemplate = (commentItem) => {
  const {emotion, comment, author, date, isDeleting} = commentItem;

  return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${dayjs().to(dayjs(date))}</span>
          <button class="film-details__comment-delete" type="button"${isDeleting ? ' disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
        </p>
      </div>
    </li>`;
};

export default class CommentCardView extends AbstractStatefulView {
  constructor(comment) {
    super();
    this._state = CommentCardView.convertCommentToState(comment);
  }

  get template() {
    return createCommentTemplate(this._state);
  }

  #onDeleteCommentClick = (evt) => {
    evt.preventDefault();
    this._callback.deleteCommentClick(CommentCardView.convertStateToComment(this._state));
  };

  setOnDeleteCommentClick = (callback) => {
    this._callback.deleteCommentClick = callback;
    this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#onDeleteCommentClick);
  };

  _restoreHandlers = () => {
    this.setOnDeleteCommentClick(this._callback.deleteCommentClick);
  };

  static convertCommentToState = (comment) => {
    const state = {...comment, isDeleting: false};

    return state;
  };

  static convertStateToComment = (state) => {
    const comment = {...state};

    delete comment.isDeleting;

    return comment;
  };
}
