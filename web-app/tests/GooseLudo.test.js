import GooseLudo from "../GooseLudo.js";
import assert from "node:assert";

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
    GooseLudo.startingBoard(GooseLudo.playerList);
});

/**
 * Tests for player turn progression.
 *
 * Verifies that the active player advances correctly
 * and wraps to the beginning of the player list.
 */
describe("playerNext", function () {
    it("moves to next player", function () {
        assert.strictEqual(GooseLudo.playerNext(0), 1);
    });

    it("wraps to first player", function () {
        assert.strictEqual(GooseLudo.playerNext(3), 0);
    });
});


describe("startingBoard", function () {
    it("creates 16 tokens", function () {
        assert.strictEqual(GooseLudo.state.tokens.length, 16);
    });

    it("creates 68 track squares plus end zones", function () {
        assert.strictEqual(GooseLudo.state.boardSquares.length, 96);
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
        const piece = GooseLudo.state.tokens.find(
            (t) => t.player === "yellow"
        );

        GooseLudo.move("yellow", piece, [5, 2]);

        assert.strictEqual(piece.position, 5);
    });

    it("cannot move onto opponent barrier", function () {
        const piece = GooseLudo.state.tokens.find(
            (t) => t.player === "yellow"
        );

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

        assert.strictEqual(result[0], 1);
        assert.strictEqual(piece.position, 1);
    });

    it("captures opponent piece", function () {
        const yellow = GooseLudo.state.tokens.find(
            (t) => t.player === "yellow"
        );

        const red = GooseLudo.state.tokens.find(
            (t) => t.player === "red"
        );

        yellow.position = 2;
        red.position = 6;

        GooseLudo.move("yellow", yellow, [2, 2]);

        assert.strictEqual(red.position, "home");
    });

    it("cannot capture on safe square", function () {
        const yellow = GooseLudo.state.tokens.find(
            (t) => t.player === "yellow"
        );

        const red = GooseLudo.state.tokens.find(
            (t) => t.player === "red"
        );

        yellow.position = 1;
        red.position = 12;

        GooseLudo.move("yellow", yellow, [5, 5]);

        assert.strictEqual(red.position, 12);
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
        const piece = GooseLudo.state.tokens[0];

        piece.position = 36;

        GooseLudo.squareEffects(
            "yellow",
            piece,
            36
        );

        assert.strictEqual(piece.position, 60);
    });

    it("dice square teleports to other dice square", function () {
        const piece = GooseLudo.state.tokens[0];

        GooseLudo.squareEffects(
            "yellow",
            piece,
            12
        );

        assert.strictEqual(piece.position, 48);
    });

    it("well square causes wait penalty", function () {
        const piece = GooseLudo.state.tokens[0];

        GooseLudo.squareEffects(
            "yellow",
            piece,
            23
        );

        assert.strictEqual(piece.waitTurns, 2);
    });
});






/**
 * Tests for victory detection.
 *
 * A player wins when all four of their tokens
 * have reached the end zone.
 */

describe("isVictory", () => {
    it("returns true when all player tokens reach end", function () {
        GooseLudo.state.tokens
            .filter((t) => t.player === "yellow")
            .forEach(t => {
                t.position = "end";
            });

        assert.strictEqual(GooseLudo.isVictory(), true);
    });

    it("returns false when not all tokens reach end", () => {
        assert.strictEqual(GooseLudo.isVictory(), false);
    });
});

