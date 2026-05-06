import React, { useContext, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getStyles, getColors } from './styles';
import { ThemeContext } from './ThemeContext';
import { useBooks } from './BooksContext';
import { BOOK_STATUS } from './constants';

export default function StatsScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { books, calculateProgress } = useBooks();

  const styles = getStyles(theme);
  const colors = getColors(theme);

  const stats = useMemo(() => {
    const totalBooks = books.length;
    const toRead = books.filter(b => b.status === BOOK_STATUS.TO_READ).length;
    const reading = books.filter(b => b.status === BOOK_STATUS.READING).length;
    const read = books.filter(b => b.status === BOOK_STATUS.READ).length;
    const favorites = books.filter(b => b.favorite).length;

    const ratedBooks = books.filter(b => b.rating);
    const avgRating = ratedBooks.length > 0
      ? (ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length).toFixed(1)
      : null;
    const topRated = books
      .filter(b => b.rating)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    const pagesRead = books.reduce((sum, b) => {
      if (b.currentPage && (b.status === BOOK_STATUS.READING || b.status === BOOK_STATUS.READ)) {
        return sum + b.currentPage;
      }
      return sum;
    }, 0);

    const currentlyReading = books.filter(
      b => b.status === BOOK_STATUS.READING && b.currentPage && b.totalPages
    );

    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth();
    const thisMonthStart = new Date(thisYear, thisMonth, 1).getTime();
    const yearStart = new Date(thisYear, 0, 1).getTime();

    const booksReadThisMonth = books.filter(
      b => b.status === BOOK_STATUS.READ && b.createdAt >= thisMonthStart
    ).length;
    const booksReadThisYear = books.filter(
      b => b.status === BOOK_STATUS.READ && b.createdAt >= yearStart
    ).length;

    const recentBooks = books
      .filter(b => b.status === BOOK_STATUS.READ)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    const monthlyData = [];
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(thisYear, thisMonth - i, 1);
      const monthStart = monthDate.getTime();
      const nextMonth = new Date(thisYear, thisMonth - i + 1, 1).getTime();
      const count = books.filter(
        b => b.status === BOOK_STATUS.READ && b.createdAt >= monthStart && b.createdAt < nextMonth
      ).length;
      monthlyData.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        count,
      });
    }
    monthlyData.reverse();

    return {
      totalBooks,
      toRead,
      reading,
      read,
      favorites,
      booksReadThisMonth,
      booksReadThisYear,
      recentBooks,
      monthlyData,
      avgRating,
      topRated,
      pagesRead,
      currentlyReading,
    };
  }, [books]);

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 20 }}>
          Reading Statistics
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <View style={[styles.card, { width: '48%', marginBottom: 12 }]}>
            <Ionicons name="library" size={32} color={colors.primary} />
            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, marginTop: 8 }}>
              {stats.totalBooks}
            </Text>
            <Text style={{ color: colors.tint }}>Total Books</Text>
          </View>

          <View style={[styles.card, { width: '48%', marginBottom: 12 }]}>
            <Ionicons name="checkmark-circle" size={32} color={colors.accent} />
            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, marginTop: 8 }}>
              {stats.read}
            </Text>
            <Text style={{ color: colors.tint }}>Books Read</Text>
          </View>

          <View style={[styles.card, { width: '48%', marginBottom: 12 }]}>
            <Ionicons name="book" size={32} color={colors.primary} />
            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, marginTop: 8 }}>
              {stats.reading}
            </Text>
            <Text style={{ color: colors.tint }}>Currently Reading</Text>
          </View>

          <View style={[styles.card, { width: '48%', marginBottom: 12 }]}>
            <Ionicons name="heart" size={32} color={colors.accent} />
            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, marginTop: 8 }}>
              {stats.favorites}
            </Text>
            <Text style={{ color: colors.tint }}>Favorites</Text>
          </View>

          <View style={[styles.card, { width: '48%', marginBottom: 12 }]}>
            <Ionicons name="star" size={32} color="#FFD700" />
            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, marginTop: 8 }}>
              {stats.avgRating || '-'}
            </Text>
            <Text style={{ color: colors.tint }}>Avg Rating</Text>
          </View>

          <View style={[styles.card, { width: '48%', marginBottom: 12 }]}>
            <Ionicons name="document-text" size={32} color={colors.primary} />
            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, marginTop: 8 }}>
              {stats.pagesRead}
            </Text>
            <Text style={{ color: colors.tint }}>Pages Read</Text>
          </View>
        </View>

        <View style={{ marginTop: 12, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.neutral }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
            This Month
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 32, fontWeight: '700', color: colors.primary }}>
                {stats.booksReadThisMonth}
              </Text>
              <Text style={{ color: colors.tint }}>Books Read</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 32, fontWeight: '700', color: colors.accent }}>
                {stats.booksReadThisYear}
              </Text>
              <Text style={{ color: colors.tint }}>This Year</Text>
            </View>
          </View>
        </View>

        {stats.monthlyData.length > 0 && (
          <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.neutral }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              Monthly Progress (Last 6 Months)
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 100 }}>
              {stats.monthlyData.map((item, index) => (
                <View key={index} style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 30,
                      height: Math.max(10, item.count * 15),
                      backgroundColor: colors.primary,
                      borderRadius: 4,
                    }}
                  />
                  <Text style={{ fontSize: 10, color: colors.tint, marginTop: 4 }}>{item.month}</Text>
                  <Text style={{ fontSize: 10, color: colors.text }}>{item.count}</Text>
                </View>
              ))}
            </View>
          </View>
)}

        {stats.topRated.length > 0 && (
          <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.neutral }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              Top Rated Books
            </Text>
            {stats.topRated.map((book, index) => (
              <View
                key={book.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.neutral,
                }}
              >
                <View style={{ width: 30, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Ionicons
                        key={star}
                        name={star <= book.rating ? 'star' : 'star-outline'}
                        size={12}
                        color={star <= book.rating ? '#FFD700' : colors.tint}
                      />
                    ))}
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>{book.title}</Text>
                  <Text style={{ fontSize: 12, color: colors.tint }}>{book.author || 'Unknown'}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {stats.currentlyReading.length > 0 && (
          <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.neutral }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              Currently Reading
            </Text>
            {stats.currentlyReading.map(book => (
              <View key={book.id} style={{ marginBottom: 16 }}>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>{book.title}</Text>
                <View style={{ height: 6, backgroundColor: colors.neutral, borderRadius: 3, marginTop: 6 }}>
                  <View
                    style={{
                      height: 6,
                      width: `${calculateProgress(book.currentPage, book.totalPages)}%`,
                      backgroundColor: colors.primary,
                      borderRadius: 3,
                    }}
                  />
                </View>
                <Text style={{ color: colors.tint, fontSize: 12, marginTop: 4 }}>
                  {book.currentPage} / {book.totalPages} pages ({calculateProgress(book.currentPage, book.totalPages)}%)
                </Text>
              </View>
            ))}
          </View>
        )}

        {stats.recentBooks.length > 0 && (
          <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.neutral }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              Recently Completed
            </Text>
            {stats.recentBooks.map((book, index) => (
              <View
                key={book.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.neutral,
                }}
              >
                <View style={{ width: 30, alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.primary }}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>{book.title}</Text>
                  <Text style={{ fontSize: 12, color: colors.tint }}>{book.author || 'Unknown'}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
              </View>
            ))}
          </View>
        )}

        {stats.totalBooks === 0 && (
          <View style={[styles.empty, { marginTop: 40 }]}>
            <Ionicons name="stats-chart" size={64} color={colors.tint} />
            <Text style={{ fontSize: 18, color: colors.text, marginTop: 16 }}>No books yet</Text>
            <Text style={{ color: colors.tint, marginTop: 8 }}>Add books to see your reading stats</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}