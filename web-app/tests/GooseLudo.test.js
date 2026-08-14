import R from "../ramda.js";
import GooseLudo from "../GooseLudo.js";
import assert from "assert";

/**
 * Resets the GooseLudo game state before each test.
 *
 * Ensures that tests are isolated and do not share
 * board, token, or player state.
 *
 */

beforeEach(function () {
    GooseLudo.state.tokens = [];
    GooseLudo.state.currentPlayer = 0;
});

const playersList = function (count) {
    const playerColours = ["yellow", "blue", "red", "green"];
    return playerColours.slice(0, count);
};


describe("playerNext", function () {
    [2, 3, 4].forEach(function (count) {
        it(`moves to next player for ${count} players`, function () {
            // Given a list of players
            const players = playersList(count);

            // When a turn ends and the next starts
            const next = GooseLudo.playerNext(0, players);

            // Then the next player is the next in the list
            assert(
                R.equals(next, 1),
                ("Not changing to next player in the list")
            );
        });

        it(`wraps to first player dynamically for ${count} players`,
            function () {
                // Given a list of players
                const players = playersList(count);

                // When the last player's turn ends and the next starts
                const lastPlayerIndex = players.length - 1;
                const next = GooseLudo.playerNext(lastPlayerIndex, players);

                // Then the next player is the first in the list
                assert(
                    R.equals(next, 0),
                    ("Not wrapping around to player one")
                );
            });
    });
});


describe("startingBoard", function () {
    [2, 3, 4].forEach(function (count) {
        it(`Initial tokens are 4 for each player (${count} players)`,
            function () {
                // Given a list of players
                const players = playersList(count);

                // When the starting board is created
                GooseLudo.startingBoard(players);

                // Then four tokens are created for each player
                assert(
                    R.equals(GooseLudo.state.tokens.length, 4 * players.length),
                    (`There are ${GooseLudo.state.tokens.length}
                    tokens not ${4 * players.length}`)
                );
            });

        it(`Initial board had 68 squares and ${count} end zones`, function () {
            // Given a list of players
            const players = playersList(count);

            // When the starting board is created
            GooseLudo.startingBoard(players);

            // Then 68 main squares and an end zone for each players is created
            assert(
                R.equals(GooseLudo.state.boardSquares.length,
                    (68 + (8 * count))
                ),
                (`There aren't ${68 + (8 * count)} board squares`)
            );
        });
    });

});

/**
 * Tests for token movement rules.
 *
 * Verifies movement from home, barrier restrictions,
 * and capture behaviour.
 */

describe("move", function () {
    it("piece leaves home when rolling a five", function () {
        // given staring board where piece at home
        GooseLudo.startingBoard(["yellow", "blue", "red", "green"]);

        // when five rolled
        const piece = GooseLudo.state.tokens.find(
            (t) => t.player === "yellow"
        );

        GooseLudo.move("yellow", piece, [5, 2]);

        // then moved to starting position
        assert(R.equals(piece.position, 5),
            `Piece hasn't moved from home to it's starting position`);
    });

    it("cannot move onto opponent barrier", function () {
        // given starting board
        GooseLudo.startingBoard(["yellow", "blue", "red", "green"]);
        const piece = GooseLudo.state.tokens.find(
            (t) => t.player === "yellow"
        );

        // when barrier created and piece before that barrier
        piece.position = 1;

        GooseLudo.state.tokens.push(
            { player: "red", position: 5 },
            { player: "red", position: 5 }
        );

        const result = GooseLudo.move(
            "yellow",
            piece,
            [2, 2]
        );

        assert(R.equals(result[0], 1),
            `New position returned, piece allowed to move`);
        assert(R.equals(piece.position, 1),
            `Piece position modified, piece allowed to move`);
    });

    it("captures opponent piece", function () {
        GooseLudo.startingBoard(["yellow", "blue", "red", "green"]);
        const yellow = GooseLudo.state.tokens.find(
            (t) => t.player === "yellow"
        );

        const red = GooseLudo.state.tokens.find(
            (t) => t.player === "red"
        );

        yellow.position = 2;
        red.position = 6;

        GooseLudo.move("yellow", yellow, [2, 2]);

        assert(R.equals(red.position, "home"),
            `Piece not captured and not sent home`);
    });

    it("cannot capture on safe square", function () {
        GooseLudo.startingBoard(["yellow", "blue", "red", "green"]);
        const yellow = GooseLudo.state.tokens.find(
            (t) => t.player === "yellow"
        );

        const red = GooseLudo.state.tokens.find(
            (t) => t.player === "red"
        );

        yellow.position = 1;
        red.position = 12;

        GooseLudo.move("yellow", yellow, [5, 5]);

        assert(R.equals(red.position, 12),
            `Piece captured and sent home`);
    });
});
/**
 * Tests for special board square behaviour.
 *
 * Verifies bridge teleportation, dice-square movement,
 * well penalties, and barrier creation.
 */
describe("squareEffects", function () {
    it("bridge teleports piece", function () {
        GooseLudo.startingBoard(["yellow", "blue", "red", "green"]);
        const piece = GooseLudo.state.tokens[0];

        piece.position = 36;

        GooseLudo.squareEffects(
            "yellow",
            piece,
            36
        );

        assert(R.equals(piece.position, 60),
            `bridge not working`);
    });

    it("dice square teleports to other dice square", function () {
        GooseLudo.startingBoard(["yellow", "blue", "red", "green"]);
        const piece = GooseLudo.state.tokens[0];

        GooseLudo.squareEffects(
            "yellow",
            piece,
            12
        );

        assert(R.equals(piece.position, 48),
            `dice square not working`);
    });

    it("well square causes wait penalty", function () {
        GooseLudo.startingBoard(["yellow", "blue", "red", "green"]);
        const piece = GooseLudo.state.tokens[0];

        GooseLudo.squareEffects(
            "yellow",
            piece,
            24
        );

        assert(R.equals(piece.waitTurns, 3),
            `dice square not working`);

    });
});






/**
 * Tests for victory detection.
 *
 * A player wins when all four of their tokens
 * have reached the end zone.
 */

describe("isVictory", function () {
    it("returns true when all player tokens reach end", function () {
        GooseLudo.startingBoard(["yellow", "blue", "red", "green"]);
        GooseLudo.state.tokens
            .filter((t) => t.player === "yellow")
            .forEach((t) => { t.position = "yellow8"; });

        assert.strictEqual(GooseLudo.isVictory(["yellow", "blue", "red", "green"]), true);
    });

    it("returns false when not all tokens reach end", () => {
        GooseLudo.startingBoard(["yellow", "blue", "red", "green"]);
        assert.strictEqual(GooseLudo.isVictory(["yellow", "blue", "red", "green"]), false);
    });
});

