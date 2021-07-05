import "./App.css";
import * as Game from "./game";
import { useState } from "react";

const scoreString = Game.map({
  Winner: (g) => `The Winner is: ${g.winner}`,
  Deuce: () => "Deuce!!",
  Advantage: (g) => `Advantage for ${g.for}`,
  RegularPlaytime: (g) => `${g.player1Score} : ${g.player2Score}`,
});

const GameScore = ({ game }: { game: Game.Game }) => (
  <div className="this is score, it scores">{scoreString(game)}</div>
);

const stateClass = Game.map<string>({
  RegularPlaytime: () => "regular-play-time",
  Advantage: (g) => `advantage-${g.for === "Player 1" ? "1" : "2"}`,
  Deuce: () => `deuce`,
  Winner: (g) => `winner-${g.winner === "Player 1" ? "1" : "2"}`,
});

const PlayerScoring = (props: {
  player: `player ${1 | 2}`;
  onScore: () => void;
}) => {
  const playerClassName = props.player.split(" ").join("-");

  return (
    <div
      className={`you are ${playerClassName} - be very big flolumn and cuddle very good`}
    >
      <svg height="96" width="48">
        <circle
          cx="24"
          cy="17"
          r="14"
          fill="transparent"
          strokeWidth="1"
          stroke="black"
          className="head"
        ></circle>
        <polygon points="2,94 46,94 24,32" className="shirt" />
        Sorry, your browser does not support inline SVG.
      </svg>
      <button onClick={props.onScore} className="bg hover:ring">
        {props.player} scores
      </button>
    </div>
  );
};

function App() {
  const [game, updateGame] = useState(Game.start());
  return (
    <div className="App">
      <div className={stateClass(game)}>
        <div className="be very big flolumn but please don't touch">
          <GameScore game={game}></GameScore>
          <div className="take a breadth flow but please don't touch">
            <PlayerScoring
              player="player 1"
              onScore={() => updateGame(Game.playerScores("Player 1", game))}
            ></PlayerScoring>
            <PlayerScoring
              player="player 2"
              onScore={() => updateGame(Game.playerScores("Player 2", game))}
            ></PlayerScoring>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
