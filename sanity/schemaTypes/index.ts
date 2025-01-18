import { type SchemaTypeDefinition } from 'sanity'
import shipment from './shipment'
import Products from './Products'
import order from './order'
import customer from './customer'
import transaction from './transaction'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [Products, shipment, order, customer, transaction],
}
