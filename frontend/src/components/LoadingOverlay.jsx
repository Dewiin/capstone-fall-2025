import { Spinner } from "./ui/shadcn-io/spinner";
import { cn } from "@/lib/utils";

export function LoadingOverlay( {className, fixed = false} ) {
  return (
    <div 
        className={cn(
            `${fixed ? "fixed" : "absolute"} absolute inset-0 flex items-center justify-center backdrop-blur-[3px] z-100 rounded-xl`,
            className
        )}
    >
      <Spinner variant="default" size={24}></Spinner>
    </div>
  );
}
