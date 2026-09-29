export type SbiEpayMerchant = {
  id: string;
  facility_id: string;
  merchant_code: string;
  /** The key itself is never returned; only a masked hint. */
  merchant_key_masked: string;
  is_enabled: boolean;
  created_date: string;
  modified_date: string;
};

export type CreateSbiEpayMerchantBody = {
  facility_id: string;
  merchant_code: string;
  merchant_key: string;
  is_enabled: boolean;
};

export type UpdateSbiEpayMerchantBody = Partial<
  Omit<CreateSbiEpayMerchantBody, "facility_id">
>;
