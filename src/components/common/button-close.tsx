import { X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const ButtonClose = ({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) => {
  return (
    <Button
      variant="outline"
      className={cn("h-9 w-9 rounded-full bg-gray-200", className)}
      onClick={onClick}
    >
      <X className="h-6 w-6" />
    </Button>
  );
};

export default ButtonClose;
