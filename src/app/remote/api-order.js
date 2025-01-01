import { api } from "./api";

const TAG = "[api-order]";

// [GET]/admin/v1/users/{id}/orders
const getOrders = async (userId) => {
  console.log(TAG, `getOrders([GET]/orders)`, "userId", userId);
  const res = await api.get(`/users/${userId}/orders`);
  return res.data;
};
const getOrder = async (userId, orderId) => {
  console.log(TAG, `getOrders([GET]/orders)`, "userId", userId, "orderId", orderId);
  const res = await api.get(`/users/${userId}/orders/${orderId}`);
  return res.data;
};
const postOrder = async (userId, data) => {
  const res = await api.post(`/users/${userId}/orders/products`, data);
  return res.data;
};

const getProductsTypes = async () => {
  const res = await api.get("/products/types");
  return res.data;
};
const getProductsLanguages = async () => {
  const res = await api.get("/products/languages");
  return res.data;
};
const getProductsLessonTypes = async () => {
  const res = await api.get("/products/lessonTypes");
  return res.data;
};
const getProducts = async () => {
  const res = await api.get("products/list");
  // const res = await api.get("/products", {params: data});
  return res.data;
};
const getProductsList = async () => {
  const res = await api.get("/products/list");
  return res.data;
}
const putProduct = async (productId, data) => {
  const res = await api.put(`/products/${productId}`, data)
  return res.data;
}
const postProduct = async (data) => {
  const res = await api.post("/products", data);
  return res.data;
}
const getCalculates = async (queryParams) => {
  const res = await api.get("/orders/calculates", { params: queryParams });
  return res.data;
};

const postRefund = async (userId, orderId, orderProductId, data) => {
  const res = await api.post(`/users/${userId}/orders/${orderId}/orderProducts/${orderProductId}/refund`, data);
  return res.data;
};
const deleteOrder = async (userId, orderId, orderProductId) => {
  await api.delete(`/users/${userId}/orders/${orderId}/orderProducts/${orderProductId}`);
};

const getPayments = async (userId, orderId) => {
  const res = await api.get(`/users/${userId}/orders/${orderId}/payments`);
  return res.data;
};

const postPayments = async (userId, orderId, data) => {
  const res = await api.post(`/users/${userId}/orders/${orderId}/payments`, data)
  return res.data;
};

const deletePayments = async (userId, orderId, paymentId) => {
  const res = await api.delete(`/users/${userId}/orders/${orderId}/payments/${paymentId}`)
  return res.data;
};

const getPaymentDetail = async (userId, orderId, paymentId) => {
  const res = await api.get(`/users/${userId}/orders/${orderId}/payments/${paymentId}`)
  return res.data;
}

const putPayments = async (userId, orderId, paymentId, data) => {
  const res = await api.put(`/users/${userId}/orders/${orderId}/payments/${paymentId}`, data)
  return res.data;
}

const deleteProduct = async (productId) => {
  const res = await api.delete(`/products/${productId}`)
  return res.data;
}

export {
  deleteOrder,
  getCalculates,
  getOrder,
  getOrders,
  getProducts,
  getProductsLanguages,
  getProductsLessonTypes,
  getProductsTypes,
  postOrder,
  postRefund,
  getProductsList,
  putProduct,
  postProduct,
  getPayments,
  postPayments,
  deletePayments,
  getPaymentDetail,
  putPayments,
  deleteProduct,
};
