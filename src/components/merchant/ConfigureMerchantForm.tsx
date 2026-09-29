import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FC, useEffect, useMemo } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SbiEpayMerchant, UpdateSbiEpayMerchantBody } from "@/types/merchant";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { I18NNAMESPACE } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TFunction } from "i18next";
import { apis } from "@/apis";
import { toast } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";

type ConfigureMerchantFormProps = {
  facilityId: string;
  onSuccess?: (data: SbiEpayMerchant) => void;
};

// SBI merchant keys are AES keys; the first 16 bytes are used, so require at least that.
const MIN_MERCHANT_KEY_LENGTH = 16;

const buildSchema = (t: TFunction) =>
  z.object({
    merchant_code: z
      .string()
      .trim()
      .min(1, t("sbiepay_merchant_code_required")),
    merchant_key: z
      .string()
      .trim()
      .refine(
        (value) =>
          value.length === 0 || value.length >= MIN_MERCHANT_KEY_LENGTH,
        t("sbiepay_merchant_key_too_short")
      ),
    is_enabled: z.boolean(),
  });

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

export const ConfigureMerchantForm: FC<ConfigureMerchantFormProps> = ({
  facilityId,
  onSuccess,
}) => {
  const { t } = useTranslation(I18NNAMESPACE);

  const { data: merchant, refetch } = useQuery({
    queryKey: ["sbiepayMerchant", facilityId],
    queryFn: () => apis.merchants.get(facilityId),
    enabled: !!facilityId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(useMemo(() => buildSchema(t), [t])),
    defaultValues: {
      merchant_code: "",
      merchant_key: "",
      is_enabled: true,
    },
  });

  useEffect(() => {
    if (merchant) {
      form.reset({
        merchant_code: merchant.merchant_code,
        merchant_key: "",
        is_enabled: merchant.is_enabled,
      });
    }
  }, [merchant, form]);

  const createMutation = useMutation({
    mutationFn: apis.merchants.create,
    onSuccess: (data) => {
      toast.success(t("sbiepay_merchant_created"));
      refetch();
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error?.message || t("sbiepay_merchant_creation_failed"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateSbiEpayMerchantBody) =>
      apis.merchants.update(facilityId, data),
    onSuccess: (data) => {
      toast.success(t("sbiepay_merchant_updated"));
      refetch();
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error?.message || t("sbiepay_merchant_update_failed"));
    },
  });

  function onSubmit(values: FormValues) {
    if (merchant) {
      updateMutation.mutate({
        merchant_code: values.merchant_code,
        is_enabled: values.is_enabled,
        // Only rotate the key when a new one was entered.
        ...(values.merchant_key ? { merchant_key: values.merchant_key } : {}),
      });
      return;
    }

    if (!values.merchant_key) {
      form.setError("merchant_key", {
        message: t("sbiepay_merchant_key_required"),
      });
      return;
    }

    createMutation.mutate({
      facility_id: facilityId,
      merchant_code: values.merchant_code,
      merchant_key: values.merchant_key,
      is_enabled: values.is_enabled,
    });
  }

  return (
    <div className="grid gap-4">
      {merchant && (
        <Card>
          <CardHeader>
            <CardTitle>{t("sbiepay_merchant")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">{t("sbiepay_merchant_code")}</span>
              <span className="font-mono">{merchant.merchant_code}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">
                {t("sbiepay_merchant_key_masked")}
              </span>
              <span className="font-mono">{merchant.merchant_key_masked}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">
                {t("payment_collection_status")}
              </span>
              <span>{merchant.is_enabled ? t("enabled") : t("disabled")}</span>
            </div>
          </CardContent>
        </Card>
      )}
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="merchant_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("sbiepay_merchant_code")}</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="merchant_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("sbiepay_merchant_key")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    placeholder={merchant ? merchant.merchant_key_masked : ""}
                  />
                </FormControl>
                <FormDescription>
                  {merchant
                    ? t("sbiepay_merchant_key_leave_blank")
                    : t("sbiepay_merchant_key_description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_enabled"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>
                    {t("enable_payment_collection_through_sbiepay")}
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label={t(
                        "enable_payment_collection_through_sbiepay"
                      )}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {t("save")}
          </Button>
        </form>
      </Form>
    </div>
  );
};
