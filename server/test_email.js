import { generateOrderEmail } from './src/templates/orderEmailTemplate.js';
import { sendEmail, sendOrderNotificationEmail } from './src/services/email.service.js';

const mockOrder = {
  _id: '654321654321654321654321',
  orderNumber: 'ELD-1042',
  totalAmount: 385,
  items: [
    {
      name: 'Roto Ballpoint Pen 0.7mm Blue (Pack of 10)',
      price: 65,
      quantity: 2,
      image: 'http://localhost:5173/assets/roto-pen.png',
    },
    {
      name: 'Double A Copy Paper A4 80gsm (500 Sheets)',
      price: 255,
      quantity: 1,
      image: 'http://localhost:5173/assets/double-a-paper.png',
    },
  ],
  shippingAddress: {
    recipientName: 'Rawan Ahmed',
    street: '123 El-Galaa St, Floor 4, Apt 8',
    city: 'Nasr City, Cairo',
    phone: '01012345678',
  },
};

const mockUser = {
  firstName: 'Rawan',
  lastName: 'Ahmed',
  email: 'rawan@example.com',
};

async function runTest() {
  console.log('Testing Order Confirmation Email Generation...');
  const result = generateOrderEmail({
    order: mockOrder,
    user: mockUser,
    type: 'confirmed',
    clientOrigin: 'http://localhost:5173',
  });

  console.log('Subject:', result.subject);
  console.log('HTML Length:', result.html.length, 'characters');
  console.log('\n--- TEXT PREVIEW ---\n' + result.text + '\n--------------------\n');

  console.log('Testing sendOrderNotificationEmail execution...');
  const dispatchResult = await sendOrderNotificationEmail({
    order: mockOrder,
    user: mockUser,
    type: 'confirmed',
  });

  console.log('Dispatch result:', dispatchResult);
  console.log('✅ Email service test passed successfully!');
}

runTest();
