import { environment } from "../../environments/environment";

// constants.ts
export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  USER: 'user',
};

const BASE_URL = environment.baseUrl+"/api";

export const API_URLS = {
  // Auth URLs
  LOGIN_URL: BASE_URL + '/login',
  REGISTER_URL: BASE_URL + '/register',
  CHANGE_EMAIL_URL: BASE_URL + '/change-email',
  CHANGE_PASSWORD_URL: BASE_URL + '/change-password',

  // Country (endpoint not available)
  // COUNTRIES: BASE_URL + '/countries',

  // Users
  USER: BASE_URL + '/Users/GetByIdUser',
  USER_ADD_BOOK: BASE_URL + '/user/add-book',
  USER_REMOVE_BOOK: BASE_URL + '/user/remove-book',
  GET_COUNT_USERS: BASE_URL + '/Users/GetCountUsers',
  GET_ALL_USERS: BASE_URL + '/Users/GetAllUsers',
  CREATE_USER: BASE_URL + '/Users/Create',
  UPDATE_USER: BASE_URL + '/Users/Update',
  DELETE_USER: BASE_URL + '/Users/Delete',

  // Categories
  CATEGORIES: BASE_URL + '/BookCategories', // Using BookCategories since /categories doesn't exist
  BOOK_CATEGORIES: BASE_URL + '/BookCategories',
  BOOK_CATEGORIES_BY_ID: BASE_URL + '/BookCategories',
  BOOK_MIDDLE_CATEGORIES: BASE_URL + '/BookMiddleCategories',
  BOOK_MIDDLE_CATEGORIES_BY_ID: BASE_URL + '/BookMiddleCategories',
  GENERAL_CATEGORIES: BASE_URL + '/GeneralCategories',
  GENERAL_CATEGORIES_BY_ID: BASE_URL + '/GeneralCategories',
  GENERAL_GROUPS: BASE_URL + '/GeneralGroups',
  GENERAL_GROUPS_BY_ID: BASE_URL + '/GeneralGroups',

  // Books
  ALL_BOOKS: BASE_URL + '/Books/GetAll',
  RANDOM_BOOKS: BASE_URL + '/book/random',
  BOOK: BASE_URL + '/Books/Get',
  GET_COUNT_BOOKS: BASE_URL + '/Books/GetCountBooks',
  CREATE_BOOK: BASE_URL + '/Books/Create',
  UPDATE_BOOK: BASE_URL + '/Books/Update',
  DELETE_BOOK: BASE_URL + '/Books/Delete',

  // Borrowings
  BORROW_BOOK: BASE_URL + '/Borrowings/BorrowBook/borrow',
  RETURN_BOOK: BASE_URL + '/Borrowings/ReturnBook/return',
  MY_BORROWINGS: BASE_URL + '/Borrowings/MyBorrowingsForUserId/my',
  ALL_BORROWINGS: BASE_URL + '/Borrowings/AllBOrrowings/borrowings',
  GET_ACTIVE_BORROWINGS: BASE_URL + '/Borrowings/GetActiveBorrowings',
  GET_RETURNED_BOOKS_COUNT: BASE_URL + '/Borrowings/GetReturnedBooksCount',
  GET_LAST_7_DAYS_BORROW_STATS: BASE_URL + '/Borrowings/GetLast7DaysBorrowStats',
  GET_BORROW_SUMMARY: BASE_URL + '/Borrowings/GetBorrowSummary',

  // Borrow Records
  GET_BORROW_RECORDS: BASE_URL + '/BorrowRecords/GetBorrowRecords',
  GET_BORROW_RECORD_BY_ID: BASE_URL + '/BorrowRecords/GetByIdBorrowRecords',
  CREATE_BORROW_RECORD: BASE_URL + '/BorrowRecords/CreateBorrowRecord',

  // Genres
  CREATE_GENRE: BASE_URL + '/Genres/CreateGenre',
  GET_ALL_GENRES: BASE_URL + '/Genres/GetAllGenre',
  GET_GENRE_BY_ID: BASE_URL + '/Genres/GetByIdGenre',
  UPDATE_GENRE: BASE_URL + '/Genres/Update',
  DELETE_GENRE: BASE_URL + '/Genres/Delete',

  // Ratings
  GET_ALL_RATINGS: BASE_URL + '/Ratings/GetAllRatings',
  GET_RATING_BY_ID: BASE_URL + '/Ratings/GetAllRatingById',
  ADD_RATING: BASE_URL + '/Ratings/AddRate',
  UPDATE_RATING: BASE_URL + '/Ratings/UpdateRate',
  DELETE_RATING: BASE_URL + '/Ratings/DeleteRate',
};

export const AUTHORS_URL = {
  ALL_AUTHORS: BASE_URL + '/Authors/GetAll',
  AUTHOR_BY_ID: BASE_URL + '/Authors/GetById',
  CREATE_AUTHOR: BASE_URL + '/Authors/Create',
  UPDATE_AUTHOR: BASE_URL + '/Authors/Update',
  DELETE_AUTHOR: BASE_URL + '/Authors/Delete',
}

export const STATUS_CODES = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_ERROR: 500,
  BAD_REQUEST: 400,
  CREATED: 201,
  NO_CONTENT: 204,
  NOT_MODIFIED: 304,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  TOO_MANY_REQUESTS: 429,
  UNPROCESSABLE_ENTITY: 422,
};

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
};
