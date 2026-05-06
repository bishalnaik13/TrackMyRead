import { Share } from 'react-native';

export const generateCSV = (books) => {
  const headers = ['Title', 'Author', 'Status', 'Rating', 'Current Page', 'Total Pages', 'Favorite', 'Created'];
  const rows = books.map(b => [
    `"${(b.title || '').replace(/"/g, '""')}"`,
    `"${(b.author || '').replace(/"/g, '""')}"`,
    b.status || '',
    b.rating || '',
    b.currentPage || '',
    b.totalPages || '',
    b.favorite ? 'Yes' : 'No',
    b.createdAt ? new Date(b.createdAt).toISOString() : '',
  ].join(','));
  return [headers.join(','), ...rows].join('\n');
};

export const writeAndShareCSV = async (books) => {
  try {
    const csv = generateCSV(books);
    await Share.share({
      message: csv,
      title: 'Export Library',
    });
    return true;
  } catch (error) {
    console.error('Error exporting library:', error);
    return false;
  }
};