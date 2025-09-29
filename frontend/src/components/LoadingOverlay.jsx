import { Spinner } from "./ui/shadcn-io/spinner";
import { cn } from "@/lib/utils";

export function LoadingOverlay( {className} ) {
  return (
    <div 
        className={cn(
            "absolute inset-0 flex items-center justify-center backdrop-blur-[1px] z-50 rounded-xl",
            className
        )}
    >
      <Spinner variant="default" size={24}></Spinner>
    </div>
  );
}
