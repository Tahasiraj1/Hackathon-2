import { type SchemaTypeDefinition } from 'sanity'
import ProductsSchema from './ProductsSchema'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [ProductsSchema],
}
