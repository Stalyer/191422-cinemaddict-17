import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  getFilmComments = async (filmId) => this._load({url: `comments/${filmId}`}).then(ApiService.parseResponse);

  addFilmComment = async (comment, filmId) => {
    const response = await this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  deleteFilmComment = async (commentId) => await this._load({
    url: `comments/${commentId}`,
    method: Method.DELETE,
  });

  #adaptToServer = (film) => {
    const adaptedFilm = {...film,
      'film_info': { ...film.filmInfo,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.totalRating,
        'age_rating': film.filmInfo.ageRating,
        'release': {
          'date': film.filmInfo.release.date.toISOString(),
          'release_country': film.filmInfo.release.releaseCountry
        }
      },
      'user_details': {
        'watchlist': film.userDetails.watchlist,
        'already_watched': film.userDetails.alreadyWatched,
        'watching_date': film.userDetails.watchingDate instanceof Date ? film.userDetails.watchingDate.toISOString() : null,
        'favorite': film.userDetails.favorite
      }
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm['film_info']['alternativeTitle'];
    delete adaptedFilm['film_info']['totalRating'];
    delete adaptedFilm['film_info']['ageRating'];
    delete adaptedFilm['film_info']['release']['releaseCountry'];
    delete adaptedFilm.userDetails;

    return adaptedFilm;
  };
}
