import { cn } from "@/lib/utils";
import { PiSmileySad } from "react-icons/pi";

const Error = ({
  message,
  icon = true,
  className,
}: {
  message: string;
  icon?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full h-screen  flex items-center justify-center text-center" +
          className
      )}
    >
      <div className="flex justify-center items-center flex-col gap-4 text-muted-foreground">
        {icon && <PiSmileySad className="text-5xl" />}
        <p>{message || "Something went wrong"}</p>
      </div>
    </div>
  );
};

export default Error;
