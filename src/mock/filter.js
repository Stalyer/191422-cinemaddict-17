import {filter} from '../utils/filter.js';

export const generateFilter = (films) => Object.entries(filter).map(
  ([filterName, filterTasks]) => ({
    name: filterName,
    count: filterTasks(films).length,
  }),
);
