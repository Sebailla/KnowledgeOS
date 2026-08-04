import { SearchError } from "./SearchError.js";

export class SearchQueryError extends SearchError {
  public constructor(message: string) {
    super(message, "SEARCH_QUERY_INVALID");
  }
}
