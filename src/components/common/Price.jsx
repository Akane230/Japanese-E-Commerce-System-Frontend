import { Chip } from "./Chip";
import { formatPrice } from "../../utils/helpers";
import "../../styles/common/Price.css";

export const Price = ({ price, salePrice, currency = "JPY" }) => {
  return salePrice ? (
    <span className="price price--sale">
      <b className="price__current">{formatPrice(salePrice, currency)}</b>
      <s className="price__original">{formatPrice(price, currency)}</s>
      <Chip color="pink">Sale</Chip>
    </span>
  ) : (
    <b className="price__only">{formatPrice(price, currency)}</b>
  );
};
