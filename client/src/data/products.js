import fiQalbiImage from '../assets/images/book-fi-qalbi.png';
import qisasImage from '../assets/images/book-qisas.png';

export const culturalBooks = [
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `fi-qalbi-${i + 1}`,
    name: 'Fi Qalbi Ontha Ebriya',
    slug: 'fi-qalbi-ontha-ebriya',
    category: 'Books',
    image: fiQalbiImage,
    rating: 4,
    price: 122.85,
    oldPrice: 124.8,
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `qisas-${i + 1}`,
    name: 'Qisas Min Al-Hikma',
    slug: 'qisas-min-al-hikma',
    category: 'Books',
    image: qisasImage,
    rating: 4.2,
    price: 130.5,
    oldPrice: 135,
  })),
];
