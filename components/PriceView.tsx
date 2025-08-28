import { PriceFormatter } from "./PriceFormatter";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}
const PriceView = ({ price, discount, className }: Props) => {
  return (
    <div>
      <div>
        <PriceFormatter amount={price} className={className} />
        Rs{price && discount &&<PriceFormatter amount={price+(discount*price) / 100}/>}
      </div>
    </div>
  );
};

export default PriceView;
