const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const fileStore = require('./fileStore');
const { getStorageMode } = require('../config/storage');

const toPlainObject = (value) => {
  if (!value) {
    return value;
  }

  return typeof value.toObject === 'function' ? value.toObject() : value;
};

const normalizeUser = (user) => {
  if (!user || typeof user !== 'object') {
    return user;
  }

  const raw = toPlainObject(user);
  return {
    ...raw,
    _id: String(raw._id),
  };
};

const normalizeProduct = (product) => {
  const raw = toPlainObject(product);

  return {
    ...raw,
    _id: String(raw._id),
    farmerId:
      raw.farmerId && typeof raw.farmerId === 'object'
        ? normalizeUser(raw.farmerId)
        : raw.farmerId
          ? String(raw.farmerId)
          : undefined,
  };
};

const normalizeOrder = (order) => {
  const raw = toPlainObject(order);

  return {
    ...raw,
    _id: String(raw._id),
    buyerId:
      raw.buyerId && typeof raw.buyerId === 'object'
        ? normalizeUser(raw.buyerId)
        : raw.buyerId
          ? String(raw.buyerId)
          : undefined,
    products: (Array.isArray(raw.products) ? raw.products : []).map((item) => ({
      ...item,
      productId:
        item.productId && typeof item.productId === 'object'
          ? normalizeProduct(item.productId)
          : item.productId
            ? String(item.productId)
            : undefined,
    })),
  };
};

const isMongoMode = () => getStorageMode() === 'mongo';

const normalizeOptionalText = (value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const findOrCreateUser = async ({ name, phone, role }) => {
  if (!isMongoMode()) {
    return fileStore.findOrCreateUser({ name, phone, role });
  }

  const existingUser = await User.findOne({
    phone: phone.trim(),
    role,
  });

  if (existingUser) {
    existingUser.name = name.trim();
    await existingUser.save();
    return normalizeUser(existingUser);
  }

  const user = await User.create({
    name: name.trim(),
    phone: phone.trim(),
    role,
  });

  return normalizeUser(user);
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
  if (!isMongoMode()) {
    return fileStore.createProduct({
      cropName,
      price,
      quantity,
      cropType,
      season,
      state,
      market,
      grade,
      farmerId,
    });
  }

  const product = await Product.create({
    cropName: cropName.trim(),
    price: Number(price),
    quantity: Number(quantity),
    cropType: normalizeOptionalText(cropType),
    season: normalizeOptionalText(season),
    state: normalizeOptionalText(state),
    market: normalizeOptionalText(market),
    grade: normalizeOptionalText(grade),
    farmerId,
  });

  const populatedProduct = await Product.findById(product._id).populate({
    path: 'farmerId',
    select: 'name phone role',
  });

  return normalizeProduct(populatedProduct);
};

const listProducts = async (filters = {}) => {
  if (!isMongoMode()) {
    return fileStore.listProducts(filters);
  }

  const query = {};

  if (filters.cropName) {
    query.cropName = {
      $regex: filters.cropName.trim(),
      $options: 'i',
    };
  }

  if (filters.maxPrice) {
    query.price = { $lte: Number(filters.maxPrice) };
  }

  if (filters.cropType) {
    query.cropType = {
      $regex: String(filters.cropType).trim(),
      $options: 'i',
    };
  }

  if (filters.season) {
    query.season = String(filters.season).trim();
  }

  if (filters.state) {
    query.state = {
      $regex: String(filters.state).trim(),
      $options: 'i',
    };
  }

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .populate({ path: 'farmerId', select: 'name phone role' });

  return products.map(normalizeProduct);
};

const getProductsByIds = async (ids) => {
  if (!isMongoMode()) {
    return fileStore.getProductsByIds(ids.map(String));
  }

  const products = await Product.find({ _id: { $in: ids } });
  return products.map((product) => {
    const raw = toPlainObject(product);
    return {
      ...raw,
      _id: String(raw._id),
      farmerId: String(raw.farmerId),
    };
  });
};

const decrementProductQuantities = async (items) => {
  if (!isMongoMode()) {
    return fileStore.decrementProductQuantities(items);
  }

  await Promise.all(
    items.map((item) =>
      Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -Number(item.quantity) },
      })
    )
  );
};

const createOrder = async ({ buyerId, products, totalAmount, status = 'pending' }) => {
  if (!isMongoMode()) {
    return fileStore.createOrder({ buyerId, products, totalAmount, status });
  }

  const order = await Order.create({
    buyerId,
    products,
    totalAmount,
    status,
  });

  const populatedOrder = await Order.findById(order._id)
    .populate({ path: 'buyerId', select: 'name phone role' })
    .populate({ path: 'products.productId', select: 'cropName price quantity farmerId' });

  return normalizeOrder(populatedOrder);
};

const listOrders = async () => {
  if (!isMongoMode()) {
    return fileStore.listOrders();
  }

  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate({ path: 'buyerId', select: 'name phone role' })
    .populate({ path: 'products.productId', select: 'cropName price quantity farmerId' });

  return orders.map(normalizeOrder);
};

const updateOrderStatus = async (orderId, status) => {
  if (!isMongoMode()) {
    return fileStore.updateOrderStatus(orderId, status);
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  )
    .populate({ path: 'buyerId', select: 'name phone role' })
    .populate({ path: 'products.productId', select: 'cropName price quantity farmerId' });

  return order ? normalizeOrder(order) : null;
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
