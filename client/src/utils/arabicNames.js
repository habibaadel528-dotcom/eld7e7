/**
 * Helper to get user display names with Arabic transliteration support
 */
export function formatUserName(user, lang = 'en') {
  if (!user) {
    return {
      firstName: lang === 'ar' ? 'عزيزنا' : 'User',
      lastName: '',
      fullName: lang === 'ar' ? 'حسابي' : 'User',
      initial: lang === 'ar' ? 'ح' : 'U',
    };
  }

  const rawFirstName = user.firstName || (user.name ? user.name.split(' ')[0] : '');
  const rawLastName = user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : '');
  const rawFullName = user.name || (rawFirstName ? `${rawFirstName} ${rawLastName}`.trim() : '');

  if (lang !== 'ar') {
    const fn = rawFirstName || 'User';
    const ln = rawLastName || '';
    const full = rawFullName || `${fn} ${ln}`.trim() || 'User';
    return {
      firstName: fn,
      lastName: ln,
      fullName: full,
      initial: full.charAt(0).toUpperCase() || 'U',
    };
  }

  // Common transliterations for English names to Arabic
  const nameDictionary = {
    'habiba': 'حبيبة',
    'ayman': 'أيمن',
    'eman': 'إيمان',
    'mohamed': 'محمد',
    'muhammad': 'محمد',
    'ahmed': 'أحمد',
    'ali': 'علي',
    'omar': 'عمر',
    'amr': 'عمرو',
    'mahmoud': 'محمود',
    'mostafa': 'مصطفى',
    'mustafa': 'مصطفى',
    'nour': 'نور',
    'sarah': 'سارة',
    'sara': 'سارة',
    'mariam': 'مريم',
    'fatma': 'فاطمة',
    'salma': 'سلمى',
    'mona': 'منى',
    'rana': 'رنا',
    'reem': 'ريم',
    'nada': 'ندى',
    'youssef': 'يوسف',
    'yousef': 'يوسف',
    'hassan': 'حسن',
    'hussein': 'حسين',
    'tarek': 'طارق',
    'khaled': 'خالد',
    'ziad': 'زياد',
    'zeyad': 'زياد',
    'user': 'عزيزنا',
    'customer': 'عميلنا',
    'admin': 'المدير',
  };

  const translateWord = (w) => {
    if (!w) return '';
    const lower = w.toLowerCase().trim();
    return nameDictionary[lower] || w;
  };

  const arFirstName = translateWord(rawFirstName) || 'عزيزنا';
  const arLastName = translateWord(rawLastName) || '';
  const arFullName = rawFullName
    ? rawFullName.split(/\s+/).map(translateWord).join(' ')
    : (arFirstName + (arLastName ? ` ${arLastName}` : ''));

  return {
    firstName: arFirstName,
    lastName: arLastName,
    fullName: arFullName,
    initial: arFullName.charAt(0) || 'ح',
  };
}
