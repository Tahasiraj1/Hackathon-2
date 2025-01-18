import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'shipment',
  title: 'Shipment',
  type: 'document',
  fields: [
    defineField({
      name: 'tracking_id',
      title: 'Tracking ID',
      type: 'string',
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "reference",
      to: [{ type: "order" }], // Reference to order schema
    }),
    defineField({
      name: 'shipment_status',
      title: 'Shipment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'In Transit', value: 'in_transit' },
          { title: 'Delivered', value: 'delivered' },
        ],
      },
    }),
    defineField({
      name: 'estimated_delivery_date',
      title: 'Estimated Delivery Date',
      type: 'date',
    }),
    defineField({
      name: 'carrier',
      title: 'Carrier',
      type: 'string',
    }),
    defineField({
      name: 'shipment_origin',
      title: 'Shipment Origin',
      type: 'string',
    }),
    defineField({
      name: 'shipment_destination',
      title: 'Shipment Destination',
      type: 'string',
    }),
    defineField({
      name: "customer",
      title: "Customer",
      type: "reference",
      to: [{ type: "customer" }], // Reference to customer schema
    }),
  ],
})

