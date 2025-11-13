import { cn } from "@/lib/utils";
interface Props {
  children: React.ReactNode;
  className?: string;
}
export const Title = ({ children, className }: Props) => {
  return (
    <h2 className={cn("text-2xl font-semibold", className)}>{children}</h2>
  );
};
