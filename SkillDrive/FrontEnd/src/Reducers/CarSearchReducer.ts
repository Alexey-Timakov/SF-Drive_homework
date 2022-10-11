import { CarSearchResults } from "../Interfaces/ICarSearchResults";
import { ADD_DEFAULT_CARS, } from "../Actions/carSearchAction";

const DEFAULT_STATE: CarSearchResults = {
  defaultResults: [],
  fetchedResults: [],
}

export const searchOptions = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ADD_DEFAULT_CARS:
      const defaultResults = action.payload;
      return {
        ...state,
        defaultResults
      };
    default: return state;
  }
};