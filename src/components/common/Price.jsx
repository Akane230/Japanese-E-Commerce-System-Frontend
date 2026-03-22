import { Chip } from "./Chip";
import "../../styles/common/Price.css";

export const Price = ({ price, salePrice }) => {
  const format = (p) => {
    const num = parseFloat(p);
    return isNaN(num) ? "¥0.00" : `¥${num.toFixed(2)}`;
  };

  return salePrice ? (
    <span className="price price--sale">
      <b className="price__current">{format(salePrice)}</b>
      <s className="price__original">{format(price)}</s>
      <Chip color="pink">Sale</Chip>
    </span>
  ) : (
    <b className="price__only">{format(price)}</b>
  );
};
