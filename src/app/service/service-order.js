import {
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
} from "../remote/api-order";

const TAG = "[service-order]";

const ServiceOrder = {
  getOrderList: (userId) => {
    console.log(TAG, "orderList", userId);
    return getOrders(userId);
  },
  getOneOrder: (userId, orderId) => {
    console.log(TAG, "orderList", userId, "orderId", orderId);
    return getOrder(userId, orderId);
  },
  createOrder: (userId, data) => {
    return postOrder(userId, data);
  },
  getProductTypesList: () => {
    return getProductsTypes();
  },
  getProductLanguagesList: () => {
    return getProductsLanguages();
  },
  getProductLessonTypesList: () => {
    return getProductsLessonTypes();
  },
  getProducts: () => {
    return getProducts();
  },
  getCalculates: (data) => {
    return getCalculates(data);
  },
  refund: (userId, orderId, orderProductId, data) => {
    return postRefund(userId, orderId, orderProductId, data);
  },
  cancelOrder: (userId, orderId, orderProductId) => {
    deleteOrder(userId, orderId, orderProductId);
  },
  getProductsList: () => {
    return getProductsList();
  },
  updateProduct: (productId, data) => {
    return putProduct(productId, data);
  },
  createProduct: (data) => {
    return postProduct(data);
  },
  getPayments: (userId, orderId) => {
    return getPayments(userId, orderId);
  },
  postPayments: (userId, orderId, data) => {
    return postPayments(userId, orderId, data);
  },
  cancelPayment: (userId, orderId, paymentId) => {
    return deletePayments(userId, orderId, paymentId);
  },
  getPaymentDetail: (userId, orderId, paymentId) => {
    return getPaymentDetail(userId, orderId, paymentId);
  },
  modifyPayment: (userId, orderId, paymentId, data) => {
    return putPayments(userId, orderId, paymentId, data);
  },
  deleteProduct: (productId) => {
    return deleteProduct(productId);
  }
};

export default ServiceOrder;
