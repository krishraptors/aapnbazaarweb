const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const bundledDataFilePath = path.join(__dirname, '..', 'data', 'golamart-dev.json');
const dataFilePath = process.env.VERCEL
  ? path.join('/tmp', 'golamart-dev.json')
  : bundledDataFilePath;

const initialStore = {
  users: [],
  products: [],
  orders: [],
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const createId = (prefix) => `${prefix}_${crypto.randomUUID()}`;
const normalizeOptionalText = (value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const ensureStoreFile = async () => {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });

  try {
    await fs.access(dataFilePath);
  } catch (_error) {
    try {
      const seed = await fs.readFile(bundledDataFilePath, 'utf8');
      await fs.writeFile(dataFilePath, seed);
    } catch (_seedError) {
      await fs.writeFile(dataFilePath, JSON.stringify(initialStore, null, 2));
    }
  }
};

const readStore = async () => {
  await ensureStoreFile();
  const raw = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(raw);
};

const writeStore = async (store) => {
  await fs.writeFile(dataFilePath, JSON.stringify(store, null, 2));
  return store;
};

const sortByCreatedAtDesc = (items) =>
  [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const attachProductRelations = (product, store) => ({
  ...product,
  farmerId: store.users.find((user) => user._id === product.farmerId) ?? product.farmerId,
});

const attachOrderRelations = (order, store) => ({
  ...order,
  buyerId: store.users.find((user) => user._id === order.buyerId) ?? order.buyerId,
});

const findOrCreateUser = async ({ name, phone, role }) => {
  const store = await readStore();
  const normalizedPhone = phone.trim();
  const normalizedName = name.trim();
  const timestamp = new Date().toISOString();

  const existingUser = store.users.find(
    (user) => user.phone === normalizedPhone && user.role === role
  );

  if (existingUser) {
    existingUser.name = normalizedName;
    existingUser.updatedAt = timestamp;
    await writeStore(store);
    return clone(existingUser);
  }

  const user = {
    _id: createId('usr'),
    name: normalizedName,
    phone: normalizedPhone,
    role,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.users.unshift(user);
  await writeStore(store);
  return clone(user);
};

const createProduct = async ({
  cropName,
  price,
  quantity,
  cropType,
  season,
  state,
  market,
  grade,
  farmerId,
}) => {
  const store = await readStore();
  const timestamp = new Date().toISOString();

  const product = {
    _id: createId('prd'),
    cropName: cropName.trim(),
    price: Number(price),
    quantity: Number(quantity),
    cropType: normalizeOptionalText(cropType),
    season: normalizeOptionalText(season),
    state: normalizeOptionalText(state),
    market: normalizeOptionalText(market),
    grade: normalizeOptionalText(grade),
    farmerId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.products.unshift(product);
  await writeStore(store);

  return attachProductRelations(product, store);
};

const listProducts = async (filters = {}) => {
  const store = await readStore();
  const filteredProducts = sortByCreatedAtDesc(store.products).filter((product) => {
    const matchesCropName = filters.cropName
      ? product.cropName.toLowerCase().includes(filters.cropName.toLowerCase())
      : true;
    const matchesPrice = filters.maxPrice ? product.price <= Number(filters.maxPrice) : true;
    const matchesCropType = filters.cropType
      ? (product.cropType ?? '').toLowerCase().includes(String(filters.cropType).toLowerCase())
      : true;
    const matchesSeason = filters.season ? product.season === filters.season : true;
    const matchesState = filters.state
      ? (product.state ?? '').toLowerCase().includes(String(filters.state).toLowerCase())
      : true;

    return matchesCropName && matchesPrice && matchesCropType && matchesSeason && matchesState;
  });

  return filteredProducts.map((product) => attachProductRelations(product, store));
};

const getProductsByIds = async (ids) => {
  const store = await readStore();
  return store.products.filter((product) => ids.includes(product._id)).map(clone);
};

const decrementProductQuantities = async (items) => {
  const store = await readStore();
  const timestamp = new Date().toISOString();

  for (const item of items) {
    const product = store.products.find((entry) => entry._id === String(item.productId));

    if (!product) {
      const error = new Error(`Product not found for id ${item.productId}`);
      error.statusCode = 400;
      throw error;
    }

    if (product.quantity < Number(item.quantity)) {
      const error = new Error(`Insufficient quantity available for ${product.cropName}`);
      error.statusCode = 400;
      throw error;
    }

    product.quantity -= Number(item.quantity);
    product.updatedAt = timestamp;
  }

  await writeStore(store);
};

const createOrder = async ({ buyerId, products, totalAmount, status = 'pending' }) => {
  const store = await readStore();
  const timestamp = new Date().toISOString();

  const order = {
    _id: createId('ord'),
    buyerId,
    products: products.map((item) => ({
      productId: String(item.productId),
      cropName: item.cropName,
      quantity: Number(item.quantity),
      price: Number(item.price),
    })),
    totalAmount: Number(totalAmount),
    status,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.orders.unshift(order);
  await writeStore(store);

  return attachOrderRelations(order, store);
};

const listOrders = async () => {
  const store = await readStore();
  return sortByCreatedAtDesc(store.orders).map((order) => attachOrderRelations(order, store));
};

const updateOrderStatus = async (orderId, status) => {
  const store = await readStore();
  const order = store.orders.find((entry) => entry._id === orderId);

  if (!order) {
    return null;
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  await writeStore(store);

  return attachOrderRelations(order, store);
};

module.exports = {
  findOrCreateUser,
  createProduct,
  listProducts,
  getProductsByIds,
  decrementProductQuantities,
  createOrder,
  listOrders,
  updateOrderStatus,
};
