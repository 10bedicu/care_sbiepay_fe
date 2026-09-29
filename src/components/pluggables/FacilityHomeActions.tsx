import { FC, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { ConfigureMerchantForm } from "@/components/merchant/ConfigureMerchantForm";
import { Facility } from "@/types/facility";
import { I18NNAMESPACE } from "@/lib/constants";
import { SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type FacilityHomeActionsProps = {
  facility: Facility;
  className?: string;
};

const FacilityHomeActions: FC<FacilityHomeActionsProps> = ({
  facility,
  className,
}) => {
  const { t } = useTranslation(I18NNAMESPACE);
  const [open, setOpen] = useState(false);

  if (!facility) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="care-sbiepay-container">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex justify-start items-center border border-gray-200 rounded-md p-2 shadow-sm",
            className
          )}
        >
          <SettingsIcon />
          {t("configure_sbiepay_merchant")}
        </Button>
      </SheetTrigger>
      <SheetContent className="care-sbiepay-container w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("configure_sbiepay_merchant")}</SheetTitle>
          <SheetDescription>
            {t("configure_sbiepay_merchant_description")}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <ConfigureMerchantForm
            facilityId={facility.id}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FacilityHomeActions;
