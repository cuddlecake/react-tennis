import * as Game from "./game";

type Course = Game.PlayerStr[];
const Course = (...scorers: (1 | 2)[]): Course =>
  scorers.map((p) => `Player ${p}` as Game.PlayerStr);

const play = (course: Course) =>
  course.reduce(
    (prevGame, scorer) => Game.playerScores(scorer, prevGame),
    Game.start()
  );

const expectTag = (tag: Game.GameTag, game: Game.Game) => {
  expect(game.tag).toBe(tag);
};

const runCourses = (
  courses: (1 | 2)[][],
  itDescr: string,
  itExpect: (game: Game.Game, course: Course) => any
) => {
  courses.forEach((course, index) => {
    it(itDescr + ` (course#${index + 1})`, () => {
      const parsedCourse = Course(...course);
      const game = play(Course(...course));
      itExpect(game, parsedCourse);
    });
  });
};

describe("Game", () => {
  runCourses(
    [
      [1, 1, 2, 1, 1],
      [2, 2, 1, 1, 1, 2, 2, 2],
      [1, 1, 2, 2, 2, 2, 2],
      [2, 2, 2, 1, 1, 1, 1, 1],
    ],
    "should let a player win through regular playtime",

    (game, course) => {
      expectTag("Winner", game);
      expect(game.tag === "Winner" && game.winner).toBe(
        course[course.length - 1]
      );
    }
  );

  runCourses(
    [
      [2, 2, 2, 1, 1, 1],
      [1, 1, 1, 2, 2, 2],
      [1, 1, 2, 1, 2, 2],
      [2, 2, 1, 2, 1, 1],
      [2, 2, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1],
      [1, 1, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2],
    ],
    "should result in a deuce on equal amounts of scores",
    (game) => {
      expectTag("Deuce", game);
    }
  );

  runCourses(
    [
      [1, 1, 1, 2, 2, 2, 1],
      [2, 2, 2, 1, 1, 1, 2],
    ],
    "should result in advantage after score during deuce",
    (game, course) => {
      expectTag("Advantage", game);
      expect(game.tag === "Advantage" && game.for).toBe(
        course[course.length - 1]
      );
    }
  );
});
