import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {EMOTIONS} from '../const.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const createCommentsTemplate = (comments) => {
  const createCommentTemplate = (comment) => (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${comment.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${dayjs().to(dayjs(comment.date))}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );

  const createCommentsListTemplate = (items) => {
    let commentsList = '';
    items.forEach((comment) => {
      commentsList += createCommentTemplate(comment);
    });
    return commentsList;
  };

  const createEmojiListTemplate = (currentEmotion) => EMOTIONS.map((emotion) => `<input
    class="film-details__emoji-item visually-hidden"
    name="comment-emoji"
    type="radio"
    id="emoji-${emotion}"
    value="${emotion}"
    ${currentEmotion === emotion ? 'checked' : ''}
  >
  <label
    class="film-details__emoji-label"
    for="emoji-${emotion}"
    >
    <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
  </label>`).join('');

  const createNewCommentTemplate = (newComment) => {
    const {emotion, comment} = newComment;
    const emojiImageTemplate = emotion ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">` : '';
    const userComment = comment ? comment : '';
    const emojiListTemplate = createEmojiListTemplate(emotion);

    return `<div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${emojiImageTemplate}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${userComment}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emojiListTemplate}
      </div>
    </div>`;
  };

  const commentsListTemplate = (items) => {
    if (!items.length) {
      return;
    }

    return `<ul class="film-details__comments-list">${createCommentsListTemplate(items)}</ul>`;
  };

  return `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.items.length}</span></h3>
    ${commentsListTemplate(comments.items)}
    ${createNewCommentTemplate(comments.newComment)}
  </section>`;
};

export default class CommentsView extends AbstractStatefulView {
  constructor(comments) {
    super();
    this._state = CommentsView.convertCommentsToState(comments);
    this.#setOnInner();
  }

  get template() {
    return createCommentsTemplate(this._state);
  }

  #onChangeEmoji = (evt) => {
    this.updateElement({...this._state, newComment: {...this._state.newComment, emotion: evt.target.value}});
  };

  #onCommentUserInput = (evt) => {
    evt.preventDefault();
    this._setState({newComment: {...this._state.newComment, comment: evt.target.value}});
  };

  _restoreHandlers = () => {
    this.#setOnInner();
  };

  #setOnInner = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#onChangeEmoji);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#onCommentUserInput);
  };

  static convertCommentsToState = (comments) => {
    const state = {items: [...comments], newComment: {emotion: null, comment: null}};

    return state;
  };

  static convertStateToComments = (state) => {
    const comments = [...state.items];

    return comments;
  };
}
