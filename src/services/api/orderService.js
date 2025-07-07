import ordersData from '@/services/mockData/orders.json';

let orders = [...ordersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  getAll: async () => {
    await delay(300);
    return [...orders];
  },

  getById: async (id) => {
    await delay(200);
    const order = orders.find(o => o.Id === parseInt(id));
    if (!order) {
      throw new Error('Order not found');
    }
    return { ...order };
  },

  create: async (orderData) => {
    await delay(500);
    const newOrder = {
      ...orderData,
      Id: Math.max(...orders.map(o => o.Id)) + 1,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    orders.push(newOrder);
    return { ...newOrder };
  },

  update: async (id, updates) => {
    await delay(400);
    const index = orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Order not found');
    }
    orders[index] = { ...orders[index], ...updates };
    return { ...orders[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Order not found');
    }
    orders.splice(index, 1);
    return { success: true };
  },
};