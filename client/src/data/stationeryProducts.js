import rotoPenImage from '../assets/images/roto-pen.png';
import faberEraserImage from '../assets/images/faber-castell-eraser.png';
import fileProductImage from '../assets/images/file-product.png';
import doubleAPaperImage from '../assets/images/double-a-paper.png';

const baseProducts = [
  {
    id: 'roto-pen',
    name: 'Roto',
    slug: 'roto-pen',
    category: 'Pens',
    image: rotoPenImage,
    rating: 4,
    price: 12.85,
    oldPrice: 15,
    status: 'out',
    color: 'blue',
  },
  {
    id: 'faber-castell-eraser',
    name: 'Faber-Castell',
    slug: 'faber-castell-eraser',
    category: 'Erasers',
    image: faberEraserImage,
    rating: 4,
    price: 5.85,
    oldPrice: 10,
    status: 'in',
    color: 'green',
  },
  {
    id: 'file-product',
    name: 'File',
    slug: 'file-product',
    category: 'Files',
    image: fileProductImage,
    rating: 4,
    price: 40,
    oldPrice: 45,
    status: 'soon',
    color: 'red',
  },
  {
    id: 'double-a-paper',
    name: 'Double A',
    slug: 'double-a-paper',
    category: 'Papers',
    image: doubleAPaperImage,
    rating: 4,
    price: 195,
    oldPrice: 210,
    status: 'in',
    color: 'blue',
  },
];

export const stationeryProducts = Array.from(
  { length: 27 },
  (_, index) => {
    const product = baseProducts[index % baseProducts.length];

    return {
      ...product,
      id: `${product.id}-${index + 1}`,
    };
  },
);

export const stationeryCategories = [
  { name: 'Pens', count: 10 },
  { name: 'Pencils', count: 5 },
  { name: 'Erasers', count: 5 },
  { name: 'Papers', count: 8 },
  { name: 'Rules', count: 17 },
  { name: 'Files', count: 5 },
];