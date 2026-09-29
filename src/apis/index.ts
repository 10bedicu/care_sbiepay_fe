import {
  CreateSbiEpayMerchantBody,
  SbiEpayMerchant,
  UpdateSbiEpayMerchantBody,
} from "@/types/merchant";

import { APIError, request } from "@/apis/request";

const BASE = "/api/care_sbiepay";

export const apis = {
  merchants: {
    /** Resolves to `null` when the facility has no merchant configured yet. */
    get: async (facilityId: string) => {
      try {
        return await request<SbiEpayMerchant>(
          `${BASE}/merchant/${facilityId}/`
        );
      } catch (error) {
        if (error instanceof APIError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
    create: async (data: CreateSbiEpayMerchantBody) => {
      return await request<SbiEpayMerchant>(`${BASE}/merchant/`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    update: async (facilityId: string, data: UpdateSbiEpayMerchantBody) => {
      return await request<SbiEpayMerchant>(
        `${BASE}/merchant/${facilityId}/`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
        }
      );
    },
  },
};
