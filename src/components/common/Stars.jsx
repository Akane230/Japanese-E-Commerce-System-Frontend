import { Icons } from "./Icons";
import "../../styles/common/Stars.css";

export const Stars = ({ rating, count, size = 14 }) => {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`stars__star ${i <= Math.round(rating) ? "stars__star--filled" : "stars__star--empty"}`}
        >
          <Icons.Star size={size} />
        </span>
      ))}
      {count != null && <span className="stars__count">({count})</span>}
    </div>
  );
};
