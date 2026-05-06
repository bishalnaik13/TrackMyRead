import PropTypes from 'prop-types';

export const bookShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string,
  coverUrl: PropTypes.string,
  favorite: PropTypes.bool,
  status: PropTypes.string,
  notes: PropTypes.string,
  createdAt: PropTypes.number,
});

export const booksArrayShape = PropTypes.arrayOf(bookShape);

export const navigationShape = PropTypes.shape({
  navigate: PropTypes.func.isRequired,
  goBack: PropTypes.func,
  getParent: PropTypes.func,
});

export const routeShape = PropTypes.shape({
  params: PropTypes.shape({
    bookId: PropTypes.string,
  }),
});