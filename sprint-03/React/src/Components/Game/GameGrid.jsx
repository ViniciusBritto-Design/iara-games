import GameCard from "./GameCard";

export default function GameGrid({ games, from }) {
  return (
    <ul className="catalog-grid" role="list">
      {games.map((game) => (
        <li key={game.slug}>
          <GameCard game={game} from={from} />
        </li>
      ))}
    </ul>
  );
}
