import { PriceFormatter } from "./PriceFormatter";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}
const PriceView = ({ price, discount, className }: Props) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <PriceFormatter amount={price} className={className} />
        
        {price && discount && (
          <PriceFormatter className="line-through text-gray-400 text-sm" amount={price + (discount * price) / 100} />
        )}
      </div>
    </div>
  );
};

export default PriceView;
