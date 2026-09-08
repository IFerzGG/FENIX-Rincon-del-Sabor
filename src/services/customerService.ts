import { ModelCustomer } from "../models/customer.model.js";
import type { CustomerQueryParams } from "../schema/customer.schema.js";

export const customerService = {
    getCustomerFilter: async (query:CustomerQueryParams) => {
        return await ModelCustomer.getFindFilter(query);
    }
}