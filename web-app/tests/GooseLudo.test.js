import GooseLudo from "../src/GooseLudo.js";

/**
 * Resets the GooseLudo game state before each test.
 *
 * Ensures that tests are isolated and do not share
 * board, token, or player state.
 * 
 */

beforeEach(function () {
    GooseLudo.tokens = [];
    GooseLudo.currentPlayer = 0;
    GooseLudo.startingBoard(GooseLudo.playerList);
});
/**
 * Tests for player turn progression.
 *
 * Verifies that the active player advances correctly
 * and wraps to the beginning of the player list.
 */
describe("playerNext", function () {
    test("moves to next player", function () {
        expect(GooseLudo.playerNext(0)).toBe(1);
    });

    test("wraps to first player", function () {
        expect(GooseLudo.playerNext(3)).toBe(0);
    });
});


describe("startingBoard", function () {
    test("creates 16 tokens", function () {
        expect(GooseLudo.tokens).toHaveLength(16);
    });

    test("creates 68 track squares plus end zones", function () {
        expect(GooseLudo.boardSquares.length).toBe(96);
    });
});

/**
 * Tests for token movement rules.
 *
 * Verifies movement from home, barrier restrictions,
 * and capture behaviour.
 */

describe("move", function () {
    test("piece leaves home when rolling a five", function () {
        const piece = GooseLudo.tokens.find(
            (t) => t.player === "yellow"
        );

        GooseLudo.move("yellow", piece, [5, 2]);

        expect(piece.position).toBe(4);
    });

    test("cannot move onto opponent barrier", function () {
        const piece = GooseLudo.tokens.find(
            (t) => t.player === "yellow"
        );

        piece.position = 1;

        GooseLudo.tokens.push(
            { player: "red", position: 5 },
            { player: "red", position: 5 }
        );

        const result = GooseLudo.move(
            "yellow",
            piece,
            [2, 2]
        );

        expect(result).toBe(1);
        expect(piece.position).toBe(1);
    });

    test("captures opponent piece", function () {
        const yellow = GooseLudo.tokens.find(
            (t) => t.player === "yellow"
        );

        const red = GooseLudo.tokens.find(
            (t) => t.player === "red"
        );

        yellow.position = 1;
        red.position = 5;

        GooseLudo.move("yellow", yellow, [2, 2]);

        expect(red.position).toBe("home");
    });

    test("cannot capture on safe square", function () {
        const yellow = GooseLudo.tokens.find(
            (t) => t.player === "yellow"
        );

        const red = GooseLudo.tokens.find(
            (t) => t.player === "red"
        );

        yellow.position = 1;
        red.position = 11;

        GooseLudo.move("yellow", yellow, [5, 5]);

        expect(red.position).toBe(11);
    });
});
/**
 * Tests for special board square behaviour.
 *
 * Verifies bridge teleportation, dice-square movement,
 * well penalties, and barrier creation.
 */
describe("squareEffects", function () {
    test("bridge teleports piece", function () {
        const piece = GooseLudo.tokens[0];

        piece.position = 35;

        GooseLudo.squareEffects(
            "yellow",
            piece,
            35
        );

        expect(piece.position).toBe(59);
    });

    test("dice square teleports to other dice square", function () {
        const piece = GooseLudo.tokens[0];

        GooseLudo.squareEffects(
            "yellow",
            piece,
            11
        );

        expect(piece.position).toBe(47);
    });

    test("well square causes wait penalty", function () {
        const piece = GooseLudo.tokens[0];

        GooseLudo.squareEffects(
            "yellow",
            piece,
            23
        );

        expect(piece.waitTurns).toBe(2);
    });
});






/**
 * Tests for victory detection.
 *
 * A player wins when all four of their tokens
 * have reached the end zone.
 */

describe("isVictory", () => {
    test("returns true when all player tokens reach end", function () {
        GooseLudo.tokens
            .filter((t) => t.player === "yellow")
            .forEach(t => {
                t.position = "end";
            });

        expect(GooseLudo.isVictory()).toBe(true);
    });

    test("returns false when not all tokens reach end", () => {
        expect(GooseLudo.isVictory()).toBe(false);
    });
});

