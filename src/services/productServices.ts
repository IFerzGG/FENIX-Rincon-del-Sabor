import { ModelProduct } from "../models/product.model.js";
import type { ProductQueryParams, ProductSchema } from "../schema/product.schema.js";

export const productService = {
   getProductsFilters: async (query: ProductQueryParams) => {
    return await ModelProduct.getFindFilter(query);
  },
  createProduct: async (data:ProductSchema) => {
    const cleanName = data.nombre.trim();

    const productExist = await ModelProduct.findByName(cleanName);
    if(productExist){
      throw new Error("El producto ya existe");
    }
    return await ModelProduct.createProduct(data);
  }
};