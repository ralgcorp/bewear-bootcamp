"use client";

import { Check } from "lucide-react";
import { Separator } from "../ui/separator";

const StepBar = () => {
  return (
    <div className="w-3/5">
      <div className="relative mt-6 flex flex-col items-start justify-between px-5 py-6">
        <div className="relative inline-flex h-9 w-full items-center justify-start space-x-3.5">
          <div className="relative flex h-9 w-[100px] items-center justify-start space-x-2">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0ead00] bg-[#0ead00] text-white">
              <Check />
            </div>
            <p className="h-[22px] w-14 text-base leading-[22.40px] font-medium text-[#656565]">
              Sacola
            </p>
          </div>
          <div className="w-full py-3">
            <Separator className="bg-[#0ead00] data-[orientation=horizontal]:h-[2px] data-[orientation=horizontal]:w-full" />
          </div>
          <div className="relative flex h-9 w-[151px] items-center justify-start space-x-2">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0ead00]">
              <p className="font-semibold text-[#0ead00]">2</p>
            </div>
            <p className="h-[22px] w-[107px] text-base leading-[22.40px] font-medium text-[#656565]">
              Identificação
            </p>
          </div>
          <div className="w-full py-3">
            <Separator className="data-[orientation=horizontal]:h-[2px] data-[orientation=horizontal]:w-full" />
          </div>
          <div className="relative flex h-9 w-[140px] items-center justify-start space-x-2">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f1f1f1]">
              <p className="font-semibold text-[#656565]">3</p>
            </div>
            <p className="h-[22px] w-24 text-base leading-[22.40px] font-medium text-[#656565]">
              Pagamento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepBar;
