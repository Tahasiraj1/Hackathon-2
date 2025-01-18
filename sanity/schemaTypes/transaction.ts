export default {
    name: 'transaction',
    type: 'document',
    title: 'Transaction',
    fields: [
       {
        name: "order",
        type: "reference",
        to: [{ type: "order" }], // Reference to order schema
        title: "Order",
        description: "The order associated with this transaction",
      },
      {
        name: 'user',
        type: 'reference',
        to: [{ type: 'customer' }], // Reference to a customer schema
        title: 'User',
        description: 'User who made the transaction',
      },
      {
        name: 'productDetails',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'product' }] }], // Reference to a product schema
        title: 'Product Details',
        description: 'Products purchased in the transaction',
      },
      {
        name: 'amount',
        type: 'number',
        title: 'Amount',
        description: 'Total amount of the transaction',
      },
      {
        name: 'paymentStatus',
        type: 'string',
        title: 'Payment Status',
        options: {
          list: [
            { title: 'Success', value: 'success' },
            { title: 'Pending', value: 'pending' },
            { title: 'Failed', value: 'failed' },
          ],
        },
      },
      {
        name: 'transactionDate',
        type: 'datetime',
        title: 'Transaction Date',
      },
    ],
  };
  