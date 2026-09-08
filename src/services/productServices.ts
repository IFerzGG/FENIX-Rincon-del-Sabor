import { ModelProduct } from "../models/product.model.js";
import type { ProductQueryParams } from "../schema/product.schema.js";

export const productService = {
   getProductsFilters: async (query: ProductQueryParams) => {
    return await ModelProduct.getFindFilter(query);
  },
};