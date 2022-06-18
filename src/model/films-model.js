import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(FilmsModel.adaptToClient);
      // console.log(this.#films);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = FilmsModel.adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  };

  static adaptToClient = (film) => {
    const adaptedFilm = {...film,
      'filmInfo': { ...film['film_info'],
        'alternativeTitle': film['film_info']['alternative_title'],
        'totalRating': film['film_info']['total_rating'],
        'ageRating': film['film_info']['age_rating'],
        'release': {
          'date': new Date(film['film_info']['release']['date']),
          'releaseCountry': film['film_info']['release']['release_country']
        }
      },
      'userDetails': {
        'watchlist': film['user_details']['watchlist'],
        'alreadyWatched': film['user_details']['already_watched'],
        'watchingDate': film['user_details']['watching_date'] !== null ? new Date(film['user_details']['watching_date']) : film['user_details']['watching_date'],
        'favorite': film['user_details']['favorite']
      }
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['filmInfo']['alternative_title'];
    delete adaptedFilm['filmInfo']['total_rating'];
    delete adaptedFilm['filmInfo']['age_rating'];
    delete adaptedFilm['filmInfo']['release']['release_country'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  };
}
