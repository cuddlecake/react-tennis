type UnionLens<TheUnion extends { tag: string }, Tag extends GameTag> = Extract<
  TheUnion,
  { tag: Tag }
>;

export type PlayerStr = `Player ${1 | 2}`;

type IGame<Tag extends string, StateProps = {}> = { tag: Tag } & StateProps;

type Score = 0 | 15 | 30 | 40;

export type Game =
  | IGame<"RegularPlaytime", { player1Score: Score; player2Score: Score }>
  | IGame<"Deuce">
  | IGame<"Advantage", { for: PlayerStr }>
  | IGame<"Winner", { winner: PlayerStr }>;

export type GameTag = Game["tag"];

export type GameMapper<Result> = {
  [key in GameTag]: (game: UnionLens<Game, key>) => Result;
};
export const map =
  <T>(mapper: GameMapper<T>) =>
  (game: Game): T => {
    return mapper[game.tag](game as any);
  };

type GameRegularPlaytime = UnionLens<Game, "RegularPlaytime">;
const GameRegularPlaytime = (score1: Score, score2: Score): Game => ({
  tag: "RegularPlaytime",
  player1Score: score1,
  player2Score: score2,
});
const GameDeuce = (): Game => ({ tag: "Deuce" });
type GameWinner = UnionLens<Game, "Winner">;
const GameWinner = (player: PlayerStr): Game => ({
  tag: "Winner",
  winner: player,
});
const GameAdvantage = (player: PlayerStr): Game => ({
  tag: "Advantage",
  for: player,
});

const getNextScore = (score: Score): Score => {
  switch (score) {
    case 0:
      return 15;
    case 15:
      return 30;
    case 30:
      return 40;
    default:
      throw Error(`Should not need to calculate next score for ${score}`);
  }
};

const handleRegularTime = (
  { player1Score, player2Score }: GameRegularPlaytime,
  scoringPlayer: PlayerStr
): Game => {
  switch (true) {
    case player1Score === 40 && scoringPlayer === "Player 1":
      return GameWinner("Player 1");

    case player2Score === 40 && scoringPlayer === "Player 2":
      return GameWinner("Player 2");

    case player1Score === 40 &&
      player2Score === 30 &&
      scoringPlayer === "Player 2":
    case player1Score === 30 &&
      player2Score === 40 &&
      scoringPlayer === "Player 1":
      return GameDeuce();
    default:
      return GameRegularPlaytime(
        scoringPlayer === "Player 1"
          ? getNextScore(player1Score)
          : player1Score,
        scoringPlayer === "Player 2" ? getNextScore(player2Score) : player2Score
      );
  }
};

export const start = (): Game => GameRegularPlaytime(0, 0);

export const playerScores = (player: PlayerStr, g: Game) => {
  return map<Game>({
    RegularPlaytime: (game) => handleRegularTime(game, player),
    Advantage: (game) =>
      game.for === player ? GameWinner(player) : GameDeuce(),
    Deuce: (game) => GameAdvantage(player),
    Winner: (game) => game,
  })(g);
};
