import axios from 'axios';
import type {
  CropSeason,
  CreateOrderPayload,
  CreateProductPayload,
  Order,
  OrderStatus,
  Product,
  UserSummary,
} from '@/types/golamart';

const detectedHost =
  typeof window !== 'undefined' ? window.location.hostname || '127.0.0.1' : '127.0.0.1';
const isLocalHost = detectedHost === '127.0.0.1' || detectedHost === 'localhost';
const currentOriginApi =
  typeof window !== 'undefined' ? `${window.location.origin}/api` : undefined;

const apiCandidates = Array.from(
  new Set(
    (
      isLocalHost
        ? [
            import.meta.env.VITE_GOLAMART_API_URL,
            `http://${detectedHost}:5000/api`,
            `http://${detectedHost}:5050/api`,
            currentOriginApi,
          ]
        : [import.meta.env.VITE_GOLAMART_API_URL, currentOriginApi]
    ).filter(Boolean)
  )
);

const golamartClient = axios.create({
  timeout: 10000,
});

let activeBaseUrl = apiCandidates[0] ?? (isLocalHost ? `http://${detectedHost}:5000/api` : '/api');

type RawProduct = {
  _id: string;
  cropName: string;
  price: number;
  quantity: number;
  createdAt: string;
  cropType?: string;
  season?: CropSeason;
  state?: string;
  market?: string;
  grade?: string;
  farmerId?: string | UserSummary;
};

type RawOrder = {
  _id: string;
  buyerId?: string | UserSummary;
  products: Array<{
    productId?: string;
    cropName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
};

const toMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? 'Request failed';
  }

  return error instanceof Error ? error.message : 'Unexpected error';
};

const createInvalidResponseError = (message: string) => {
  const error = new Error(message) as Error & { code?: string };
  error.code = 'INVALID_RESPONSE_SHAPE';
  return error;
};

const shouldRetryNextBaseUrl = (error: unknown) =>
  (axios.isAxiosError(error) &&
    (!error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT')) ||
  (error instanceof Error &&
    'code' in error &&
    (error as Error & { code?: string }).code === 'INVALID_RESPONSE_SHAPE');

const requestParsed = async <T>(
  config: Parameters<typeof golamartClient.request<unknown>>[0],
  parse: (data: unknown) => T
) => {
  const candidates = [activeBaseUrl, ...apiCandidates.filter((url) => url !== activeBaseUrl)];
  let lastError: unknown;

  for (const baseURL of candidates) {
    try {
      const response = await golamartClient.request<unknown>({
        ...config,
        baseURL,
      });
      const parsed = parse(response.data);
      activeBaseUrl = baseURL;
      return parsed;
    } catch (error) {
      lastError = error;

      if (!shouldRetryNextBaseUrl(error) || baseURL === candidates[candidates.length - 1]) {
        throw error;
      }
    }
  }

  throw lastError;
};

const normalizeUser = (value?: string | UserSummary) =>
  value && typeof value === 'object' ? value : undefined;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const extractCollection = <T>(data: unknown, key: string, label: string): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (isRecord(data) && Array.isArray(data[key])) {
    return data[key] as T[];
  }

  throw createInvalidResponseError(
    `${label} backend response is invalid. Check that the GolaMart API is connected and returning JSON arrays.`
  );
};

const extractEntity = <T>(data: unknown, key: string, label: string): T => {
  if (isRecord(data) && isRecord(data[key])) {
    return data[key] as T;
  }

  if (isRecord(data)) {
    return data as T;
  }

  throw createInvalidResponseError(
    `${label} backend response is invalid. Check that the GolaMart API is connected and returning JSON objects.`
  );
};

const normalizeProduct = (product: RawProduct): Product => ({
  _id: product._id,
  cropName: product.cropName,
  price: product.price,
  quantity: product.quantity,
  createdAt: product.createdAt,
  cropType: product.cropType,
  season: product.season,
  state: product.state,
  market: product.market,
  grade: product.grade,
  farmer: normalizeUser(product.farmerId),
});

const normalizeOrder = (order: RawOrder): Order => ({
  _id: order._id,
  buyer: normalizeUser(order.buyerId),
  products: (Array.isArray(order.products) ? order.products : []).map((item) => ({
    productId: item.productId ?? '',
    cropName: item.cropName,
    quantity: item.quantity,
    price: item.price,
  })),
  totalAmount: order.totalAmount,
  status: order.status,
  createdAt: order.createdAt,
});

export const golamartApi = {
  async listProducts() {
    try {
      const products = await requestParsed(
        {
        method: 'GET',
        url: '/products',
        },
        (data) => extractCollection<RawProduct>(data, 'products', 'Product list')
      );
      return products.map(normalizeProduct);
    } catch (error) {
      throw new Error(toMessage(error));
    }
  },

  async createProduct(payload: CreateProductPayload) {
    try {
      const product = await requestParsed(
        {
          method: 'POST',
          url: '/products',
          data: payload,
        },
        (data) => extractEntity<RawProduct>(data, 'product', 'Create product')
      );
      return normalizeProduct(product);
    } catch (error) {
      throw new Error(toMessage(error));
    }
  },

  async createOrder(payload: CreateOrderPayload) {
    try {
      const order = await requestParsed(
        {
          method: 'POST',
          url: '/orders',
          data: payload,
        },
        (data) => extractEntity<RawOrder>(data, 'order', 'Create order')
      );
      return normalizeOrder(order);
    } catch (error) {
      throw new Error(toMessage(error));
    }
  },

  async listOrders() {
    try {
      const orders = await requestParsed(
        {
          method: 'GET',
          url: '/orders',
        },
        (data) => extractCollection<RawOrder>(data, 'orders', 'Order list')
      );
      return orders.map(normalizeOrder);
    } catch (error) {
      throw new Error(toMessage(error));
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
      const order = await requestParsed(
        {
          method: 'PATCH',
          url: `/orders/${orderId}/status`,
          data: { status },
        },
        (data) => extractEntity<RawOrder>(data, 'order', 'Update order')
      );
      return normalizeOrder(order);
    } catch (error) {
      throw new Error(toMessage(error));
    }
  },
};
