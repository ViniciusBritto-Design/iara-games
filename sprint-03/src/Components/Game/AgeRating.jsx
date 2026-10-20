// Selo de classificação indicativa no padrão de cores do ClassInd brasileiro.
const RATING_CLASS = {
  Livre: "rating--l",
  10: "rating--10",
  12: "rating--12",
  14: "rating--14",
  16: "rating--16",
  18: "rating--18",
};

export default function AgeRating({ rating }) {
  const isFree = rating === "Livre";
  return (
    <span
      className={`rating ${RATING_CLASS[rating] ?? ""}`}
      title={isFree ? "Classificação livre" : `Não recomendado para menores de ${rating} anos`}
    >
      {isFree ? "L" : rating}
      <span className="visually-hidden">
        {isFree ? " — classificação livre" : ` — não recomendado para menores de ${rating} anos`}
      </span>
    </span>
  );
}
