"use client";

import { Check } from "lucide-react";
import { Separator } from "../ui/separator";

type Step = "STEP1" | "STEP2" | "STEP3";

interface StepBarProps {
  step: Step;
}

const StepBar = ({ step }: StepBarProps) => {
  // Função para obter as classes do item baseado no step e posição
  const getItemClasses = (itemPosition: 1 | 2 | 3) => {
    if (itemPosition === 1) {
      return "border-[#0ead00] bg-[#0ead00] text-white"; // FULL-CHECK sempre para ITEM1
    }

    if (itemPosition === 2) {
      switch (step) {
        case "STEP1":
          return "border-[#0ead00] bg-white text-[#0ead00]"; // OUTLINE-GREEN
        case "STEP2":
        case "STEP3":
          return "border-[#0ead00] bg-[#0ead00] text-white"; // FULL-CHECK
        default:
          return "border-[#0ead00] bg-white text-[#0ead00]";
      }
    }

    if (itemPosition === 3) {
      switch (step) {
        case "STEP1":
          return "text-[#656565] border-[#f1f1f1] bg-white"; // OUTLINE-GRAY
        case "STEP2":
          return "border-[#0ead00] bg-white text-[#0ead00]"; // OUTLINE-GREEN
        case "STEP3":
          return "border-[#0ead00] bg-[#0ead00] text-white"; // FULL-CHECK
        default:
          return "text-[#656565] border-[#f1f1f1] bg-white";
      }
    }

    return "";
  };

  // Função para obter as classes do separador baseado no step e posição
  const getSeparatorClasses = (separatorPosition: 1 | 2) => {
    if (separatorPosition === 1) {
      return "bg-[#0ead00]"; // SEPARATOR-GREEN sempre para SEPARATOR1
    }

    if (separatorPosition === 2) {
      switch (step) {
        case "STEP1":
          return "bg-[#f1f1f1]"; // SEPARATOR-GRAY
        case "STEP2":
        case "STEP3":
          return "bg-[#0ead00]"; // SEPARATOR-GREEN
        default:
          return "bg-[#f1f1f1]";
      }
    }

    return "";
  };

  // Função para renderizar o conteúdo do item
  const getItemContent = (itemPosition: 1 | 2 | 3) => {
    if (itemPosition === 1) {
      return <Check />; // Sempre ícone de check para ITEM1
    }

    if (itemPosition === 2) {
      switch (step) {
        case "STEP1":
          return "2"; // Número para STEP1
        case "STEP2":
        case "STEP3":
          return <Check />; // Check para STEP2 e STEP3
        default:
          return "2";
      }
    }

    if (itemPosition === 3) {
      switch (step) {
        case "STEP1":
          return "3"; // Número para STEP1
        case "STEP2":
          return "3"; // Número para STEP2
        case "STEP3":
          return <Check />; // Check para STEP3
        default:
          return "3";
      }
    }

    return "";
  };

  // Função para obter o texto do item
  const getItemText = (itemPosition: 1 | 2 | 3) => {
    switch (itemPosition) {
      case 1:
        return "Sacola";
      case 2:
        return "Identificação";
      case 3:
        return "Pagamento";
      default:
        return "";
    }
  };

  return (
    <div className={step === "STEP3" ? "w-full" : "w-3/5"}>
      <div className="relative mt-6 flex flex-col items-start justify-between px-5 py-6">
        <div className="relative inline-flex h-9 w-full items-center justify-start space-x-3.5">
          {/* ITEM1 - Sempre FULL-CHECK */}
          <div className="relative flex h-9 w-[100px] items-center justify-start space-x-2">
            <div
              className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 ${getItemClasses(1)}`}
            >
              {getItemContent(1)}
            </div>
            <p className="h-[22px] w-14 text-base leading-[22.40px] font-medium text-[#656565]">
              {getItemText(1)}
            </p>
          </div>

          {/* SEPARATOR1 - Sempre SEPARATOR-GREEN */}
          <div className="w-full py-3">
            <Separator
              className={`${getSeparatorClasses(1)} data-[orientation=horizontal]:h-[2px] data-[orientation=horizontal]:w-full`}
            />
          </div>

          {/* ITEM2 - Varia conforme o step */}
          <div className="relative flex h-9 w-[151px] items-center justify-start space-x-2">
            <div
              className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 font-semibold ${getItemClasses(2)}`}
            >
              {getItemContent(2)}
            </div>
            <p className="h-[22px] w-[107px] text-base leading-[22.40px] font-medium text-[#656565]">
              {getItemText(2)}
            </p>
          </div>

          {/* SEPARATOR2 - Varia conforme o step */}
          <div className="w-full py-3">
            <Separator
              className={`${getSeparatorClasses(2)} data-[orientation=horizontal]:h-[2px] data-[orientation=horizontal]:w-full`}
            />
          </div>

          {/* ITEM3 - Varia conforme o step */}
          <div className="relative flex h-9 w-[140px] items-center justify-start space-x-2">
            <div
              className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 font-semibold ${getItemClasses(3)}`}
            >
              {getItemContent(3)}
            </div>
            <p className="h-[22px] w-24 text-base leading-[22.40px] font-medium text-[#656565]">
              {getItemText(3)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepBar;
