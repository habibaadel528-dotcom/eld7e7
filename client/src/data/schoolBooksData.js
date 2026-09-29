export const SCHOOL_STAGES = [
  {
    id: 'primary',
    labelEn: 'Primary Stage',
    labelAr: 'المرحلة الابتدائية',
    icon: '🌱',
    accentColor: 'emerald',
    grades: [
      { id: 'grade1', labelEn: 'Primary 1 (Grade 1)', labelAr: 'الصف الأول الابتدائي (Grade 1)', shortLabelEn: 'Grade 1', shortLabelAr: '١ ابتدائي', sectionId: 'primaryLower' },
      { id: 'grade2', labelEn: 'Primary 2 (Grade 2)', labelAr: 'الصف الثاني الابتدائي (Grade 2)', shortLabelEn: 'Grade 2', shortLabelAr: '٢ ابتدائي', sectionId: 'primaryLower' },
      { id: 'grade3', labelEn: 'Primary 3 (Grade 3)', labelAr: 'الصف الثالث الابتدائي (Grade 3)', shortLabelEn: 'Grade 3', shortLabelAr: '٣ ابتدائي', sectionId: 'primaryLower' },
      { id: 'grade4', labelEn: 'Primary 4 (Grade 4)', labelAr: 'الصف الرابع الابتدائي (Grade 4)', shortLabelEn: 'Grade 4', shortLabelAr: '٤ ابتدائي', sectionId: 'primaryUpper' },
      { id: 'grade5', labelEn: 'Primary 5 (Grade 5)', labelAr: 'الصف الخامس الابتدائي (Grade 5)', shortLabelEn: 'Grade 5', shortLabelAr: '٥ ابتدائي', sectionId: 'primaryUpper' },
      { id: 'grade6', labelEn: 'Primary 6 (Grade 6)', labelAr: 'الصف السادس الابتدائي (Grade 6)', shortLabelEn: 'Grade 6', shortLabelAr: '٦ ابتدائي', sectionId: 'primaryUpper' },
    ],
  },
  {
    id: 'preparatory',
    labelEn: 'Preparatory Stage (Prep)',
    labelAr: 'المرحلة الإعدادية',
    icon: '📙',
    accentColor: 'orange',
    grades: [
      { id: 'prep1', labelEn: 'Prep 1 (1st Prep)', labelAr: 'الصف الأول الإعدادي (Prep 1)', shortLabelEn: 'Prep 1', shortLabelAr: '١ إعدادي', sectionId: 'preparatory' },
      { id: 'prep2', labelEn: 'Prep 2 (2nd Prep)', labelAr: 'الصف الثاني الإعدادي (Prep 2)', shortLabelEn: 'Prep 2', shortLabelAr: '٢ إعدادي', sectionId: 'preparatory' },
      { id: 'prep3', labelEn: 'Prep 3 (3rd Prep)', labelAr: 'الصف الثالث الإعدادي (Prep 3)', shortLabelEn: 'Prep 3', shortLabelAr: '٣ إعدادي', sectionId: 'preparatory' },
    ],
  },
  {
    id: 'secondary',
    labelEn: 'Secondary Stage (Sec)',
    labelAr: 'المرحلة الثانوية',
    icon: '🎓',
    accentColor: 'red',
    grades: [
      { id: 'sec1', labelEn: 'Sec 1 (1st Secondary)', labelAr: 'الصف الأول الثانوي (Sec 1)', shortLabelEn: 'Sec 1', shortLabelAr: '١ ثانوي', sectionId: 'secondary' },
      { id: 'sec2', labelEn: 'Sec 2 (2nd Secondary)', labelAr: 'الصف الثاني الثانوي (Sec 2)', shortLabelEn: 'Sec 2', shortLabelAr: '٢ ثانوي', sectionId: 'secondary' },
      { id: 'sec3', labelEn: 'Sec 3 (3rd Secondary)', labelAr: 'الصف الثالث الثانوي (Sec 3)', shortLabelEn: 'Sec 3', shortLabelAr: '٣ ثانوي', sectionId: 'secondary' },
    ],
  },
  {
    id: 'kindergarten',
    labelEn: 'Kindergarten (KG)',
    labelAr: 'رياض الأطفال',
    icon: '🧸',
    accentColor: 'pink',
    grades: [
      { id: 'kg1', labelEn: 'KG 1', labelAr: 'المستوى الأول (KG 1)', shortLabelEn: 'KG 1', shortLabelAr: 'كي جي ١', sectionId: 'kindergarten' },
      { id: 'kg2', labelEn: 'KG 2', labelAr: 'المستوى الثاني (KG 2)', shortLabelEn: 'KG 2', shortLabelAr: 'كي جي ٢', sectionId: 'kindergarten' },
    ],
  },
];

export const SCHOOL_SUBJECTS = [
  { value: 'Arabic', labelEn: 'Arabic Language', labelAr: 'اللغة العربية' },
  { value: 'Mathematics', labelEn: 'Mathematics (Math)', labelAr: 'الرياضيات / ماث' },
  { value: 'Science', labelEn: 'Science', labelAr: 'العلوم / ساينس' },
  { value: 'English', labelEn: 'English (Connect / Plus)', labelAr: 'اللغة الإنجليزية' },
  { value: 'Social Studies', labelEn: 'Social Studies', labelAr: 'الدراسات الاجتماعية' },
  { value: 'Physics', labelEn: 'Physics', labelAr: 'الفيزياء' },
  { value: 'Chemistry', labelEn: 'Chemistry', labelAr: 'الكيمياء' },
  { value: 'Biology', labelEn: 'Biology', labelAr: 'الأحياء' },
  { value: 'History', labelEn: 'History', labelAr: 'التاريخ' },
  { value: 'Geography', labelEn: 'Geography', labelAr: 'الجغرافيا' },
  { value: 'French', labelEn: 'French', labelAr: 'اللغة الفرنسية' },
  { value: 'German', labelEn: 'German', labelAr: 'اللغة الألمانية' },
  { value: 'Italian', labelEn: 'Italian', labelAr: 'اللغة الإيطالية' },
  { value: 'ICT', labelEn: 'ICT & Computing', labelAr: 'تكنولوجيا المعلومات والحاسب' },
  { value: 'Philosophy', labelEn: 'Philosophy & Logic', labelAr: 'الفلسفة والمنطق' },
  { value: 'Psychology', labelEn: 'Psychology', labelAr: 'علم النفس والاجتماع' },
  { value: 'Religion', labelEn: 'Religious Education', labelAr: 'التربية الدينية' },
  { value: 'Discover', labelEn: 'Discover', labelAr: 'اكتشف (Discover)' },
  { value: 'Other', labelEn: 'Other Subject', labelAr: 'مادة أخرى' },
];

export function getStageById(stageId) {
  return SCHOOL_STAGES.find((s) => s.id === stageId) || null;
}

export function getGradeById(gradeId) {
  for (const stage of SCHOOL_STAGES) {
    const found = stage.grades.find((g) => g.id === gradeId);
    if (found) return { ...found, stageId: stage.id };
  }
  return null;
}

export function getStageForGrade(gradeId) {
  for (const stage of SCHOOL_STAGES) {
    if (stage.grades.some((g) => g.id === gradeId)) {
      return stage.id;
    }
  }
  return '';
}

export function getGradeLabel(gradeId, lang = 'ar') {
  const g = getGradeById(gradeId);
  if (!g) return gradeId || '';
  return lang === 'ar' ? (g.shortLabelAr || g.labelAr) : (g.shortLabelEn || g.labelEn);
}

export function getStageLabel(stageId, lang = 'ar') {
  const s = getStageById(stageId);
  if (!s) return stageId || '';
  return lang === 'ar' ? s.labelAr : s.labelEn;
}

/**
 * Normalizes any school book to identify its grade (e.g. 'prep1', 'sec2', 'grade4', 'kg1')
 */
export function normalizeBookGrade(book) {
  if (!book) return '';
  if (book.grade && getGradeById(book.grade.toLowerCase())) {
    return book.grade.toLowerCase();
  }

  const str = `${book.grade || ''} ${book.subcategory || ''} ${book.name || ''} ${book.nameAr || ''}`.toLowerCase();

  // Preparatory
  if (str.includes('prep 1') || str.includes('prep1') || str.includes('أولى إعدادي') || str.includes('اولى اعدادي') || str.includes('الصف الأول الإعدادي') || str.includes('١ إعدادي')) return 'prep1';
  if (str.includes('prep 2') || str.includes('prep2') || str.includes('تانية إعدادي') || str.includes('تانيه اعدادي') || str.includes('الصف الثاني الإعدادي') || str.includes('٢ إعدادي')) return 'prep2';
  if (str.includes('prep 3') || str.includes('prep3') || str.includes('تالتة إعدادي') || str.includes('تالته اعدادي') || str.includes('الصف الثالث الإعدادي') || str.includes('٣ إعدادي')) return 'prep3';

  // Secondary
  if (str.includes('sec 1') || str.includes('sec1') || str.includes('أولى ثانوي') || str.includes('اولى ثانوي') || str.includes('الصف الأول الثانوي') || str.includes('١ ثانوي')) return 'sec1';
  if (str.includes('sec 2') || str.includes('sec2') || str.includes('تانية ثانوي') || str.includes('تانيه ثانوي') || str.includes('الصف الثاني الثانوي') || str.includes('٢ ثانوي')) return 'sec2';
  if (str.includes('sec 3') || str.includes('sec3') || str.includes('تالتة ثانوي') || str.includes('تالته ثانوي') || str.includes('الصف الثالث الثانوي') || str.includes('٣ ثانوي')) return 'sec3';

  // Primary
  if (str.includes('grade 1') || str.includes('grade1') || str.includes('primary 1') || str.includes('أولى ابتدائي') || str.includes('اولى ابتدائي') || str.includes('الصف الأول الابتدائي') || str.includes('١ ابتدائي')) return 'grade1';
  if (str.includes('grade 2') || str.includes('grade2') || str.includes('primary 2') || str.includes('تانية ابتدائي') || str.includes('تانيه ابتدائي') || str.includes('الصف الثاني الابتدائي') || str.includes('٢ ابتدائي')) return 'grade2';
  if (str.includes('grade 3') || str.includes('grade3') || str.includes('primary 3') || str.includes('تالتة ابتدائي') || str.includes('تالته ابتدائي') || str.includes('الصف الثالث الابتدائي') || str.includes('٣ ابتدائي')) return 'grade3';
  if (str.includes('grade 4') || str.includes('grade4') || str.includes('primary 4') || str.includes('رابعة ابتدائي') || str.includes('رابعه ابتدائي') || str.includes('الصف الرابع الابتدائي') || str.includes('٤ ابتدائي')) return 'grade4';
  if (str.includes('grade 5') || str.includes('grade5') || str.includes('primary 5') || str.includes('خامسة ابتدائي') || str.includes('خامسه ابتدائي') || str.includes('الصف الخامس الابتدائي') || str.includes('٥ ابتدائي')) return 'grade5';
  if (str.includes('grade 6') || str.includes('grade6') || str.includes('primary 6') || str.includes('سادسة ابتدائي') || str.includes('سادسه ابتدائي') || str.includes('الصف السادس الابتدائي') || str.includes('٦ ابتدائي')) return 'grade6';

  // KG
  if (str.includes('kg 1') || str.includes('kg1') || str.includes('المستوى الأول')) return 'kg1';
  if (str.includes('kg 2') || str.includes('kg2') || str.includes('المستوى الثاني')) return 'kg2';

  return book.grade || book.subcategory || '';
}

/**
 * Normalizes any school book to identify its stage ('primary', 'preparatory', 'secondary', 'kindergarten')
 */
export function normalizeBookStage(book) {
  if (!book) return '';
  if (book.stage && SCHOOL_STAGES.some((s) => s.id === book.stage)) {
    return book.stage;
  }
  const grade = normalizeBookGrade(book);
  if (grade) {
    return getStageForGrade(grade);
  }
  return '';
}
