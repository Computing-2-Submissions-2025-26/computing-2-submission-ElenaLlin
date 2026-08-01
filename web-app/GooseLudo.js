import R from "./ramda.js";

/**
 * GooseLudo.js is a module to model and play a cross between
 * "Parchis" and "Game of the Goose"
 * https://en.wikipedia.org/wiki/Parch%C3%ADs
 * https://en.wikipedia.org/wiki/Game_of_the_Goose
 *
 * @namespace GooseLudo
 * @author Elena Llinares
 * @version 2021/22
 */
const GooseLudo = {};

const mainPathLength = 68;
const safeSquares = [4, 11, 16, 21, 28, 33, 38, 45, 50, 55, 62, 67];
const homePositions = [5, 22, 39, 56];
const bridgeSquares = [{ from: 35, to: 59 }];
const diceSquares = [11, 47];
const wellSquare = 23;
const endZonePathLength = 7;

GooseLudo.state = {
    tokens: [],
    currentPlayer: 0,  // 0-based indexing
    boardSquares: [],
    lastPieceMoved: null
};

GooseLudo.playerList = ["yellow", "blue", "red", "green"];
GooseLudo.numPlayers = 4;


/**
 * A Board is a list of squares making the path taken by player tokens.
 * Tokens can be placed into these squares.
 * It is implemented as an array of squares.
 * @memberof GooseLudo
 * @typedef {GooseLudo.Square[]} Board
 */

/**
 * A Square is a unique position that a token can occupy.
 * A max of two tokens can be in one square.
 * @memberof GooseLudo
 * @typedef {Object} Square
 * @property {number} id - The square ID (1-based indexing)
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {string} type - Type of square (track, safe, home, or endZone)
 * @property {string} [colour] - Color of the square (optional)
 */

/**
 * A Token is a players moving piece.
 * Each player had four.
 * @memberof GooseLudo
 * @typedef {Object} Piece
 * @property {number} id - The token ID (0-based indexing)
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {number || string} position - square or home ID (1-based index)
 * @property {boolean} inBarrier - is this token part of a barrier
 */

const setSquareTypes = function (sq, i) {
    sq.id = i + 1; // 1-based indexing for squares
    sq.x = 0;
    sq.y = 0;
    if (safeSquares.includes(i)) {
        sq.type = "safe";
    }
    if (homePositions.includes(i)) {
        // map the home square to a player index based on order in homePositions
        sq.colour = GooseLudo.playerList[homePositions.indexOf(i)];
        sq.type = "home";
    }
};

const endZoneSquares = function (player, i) {
    const endSq = {};

    endSq.x = 0;
    endSq.y = 0;
    endSq.type = "endZone";

    // map the home square to a player index based on order in homePositions
    endSq.colour = player;
    endSq.id = endSq.colour + String(i);

    GooseLudo.state.boardSquares.push(endSq);

};

const createTokens = function (players) {
    R.forEach(function (player) {
        // create four distinct token objects for this player
        const newTokens = Array.from({ length: 4 }, (_, tokenIndex) => ({
            player: player,
            id: tokenIndex,
            position: "home",
            waitTurns: 0,
            inBarrier: false,
            x: 0,
            y: 0
        }));

        // append to existing tokens
        GooseLudo.state.tokens = R.concat(
            GooseLudo.state.tokens || [], newTokens
        );
    }, players);
};


/**
 * Creates and initializes the game board.
 *
 * Generates the main track squares, end-zone squares for all players,
 * and creates four tokens for each player.
 *
 * @memberof GooseLudo
 * @function startingBoard
 * @param {string[]} players - List of player colours.
 * @returns {GooseLudo.Board} The initialized board squares.
 */

GooseLudo.startingBoard = function (players) {

    GooseLudo.state.boardSquares = Array.from({
        length: mainPathLength
    }, () => ({
        id: 0,
        type: "track",
        colour: "white",
        x: 0,
        y: 0
    }));

    GooseLudo.state.boardSquares.forEach((sq, i) => setSquareTypes(sq, i));

    createTokens(GooseLudo.playerList);

    for (let i = 0; i < endZonePathLength; i++) {
        GooseLudo.playerList.forEach((player, id) => endZoneSquares(player, i));
        //const element = [index];
    }
    return GooseLudo.state.boardSquares;
};
GooseLudo.startingBoard(GooseLudo.playerList); // edited in main.js onclick

/**
 * Advances play to the next player.
 *
 * Player order wraps around to the first player after the last.
 *
 * @memberof GooseLudo
 * @function playerNext
 * @param {number} currentPlayerIndex - Current player index.
 * @returns {number} The next player's index.
 */

GooseLudo.playerNext = function (currentPlayerIndex) {
    GooseLudo.state.currentPlayer = (
        currentPlayerIndex + 1
    ) % GooseLudo.playerList.length;
    return GooseLudo.state.currentPlayer;
};

const returnLastPieceToHome = function () {
    if (GooseLudo.state.lastPieceMoved) {
        GooseLudo.state.lastPieceMoved.position = "home";
    }
};



// - if you roll a 6 and have a barrier, you break the barrier

/**
 * Rolls two dice and determines whether a reroll is allowed.
 *
 * Rerolls occur when:
 * - Both dice match.
 * - Either die is a 6.
 *
 * After three consecutive rerolls, the last moved piece is returned home.
 * If a player has no pieces at home, any rolled 6 is treated as 7.
 *
 * @memberof GooseLudo
 * @function roll
 * @param {string} playerTurn - Active player's colour.
 * @param {number} rolls - Current roll count.
 * @param {boolean} reroll - Whether rolling is permitted.
 * @returns {[number[], number, boolean]}
 * Returns dice values, updated roll count, and reroll status.
 */

GooseLudo.roll = function (playerTurn, rolls, reroll) {
    let diceResults = [0, 0];

    if (reroll && rolls < 3) {
        rolls += 1;
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        diceResults[0] = d1;
        diceResults[1] = d2;

        reroll = (d1 === d2) || d1 === 6 || d2 === 6;
    }

    if (rolls === 3 && reroll) {
        // if rolled 3 times last piece moved dies
        returnLastPieceToHome();

        diceResults = [0, 0];
    }

    // If player had all their pieces out of home, treat 6 as 7
    if (playerTurn) {
        const playerTokens = GooseLudo.state.tokens.filter(
            (token) => token.player === playerTurn
        );
        const anyAtHome = playerTokens.some(
            (token) => token.position === "home"
        );
        if (!anyAtHome) {
            R.forEach(function (die, i) {
                if (die === 6) { diceResults[i] = 7; }
            }, diceResults);
        }
    }

    return [diceResults, rolls, reroll];
};


const leaveHome = function (playerTurn, piece, diceResults) {
    const playerIndex = GooseLudo.playerList.indexOf(playerTurn);
    piece.position = homePositions[playerIndex];
    diceResults.splice(diceResults.indexOf(5), 1, 0); // removes first 5
};

const canMoveTo = function (playerTurn, piece, newPos) {
    // Check if position is within valid range
    if (newPos < 1 || newPos > mainPathLength + endZonePathLength) {
        return false;
    }

    // Check if there's a barrier (2+ opponent pieces) at newPos
    const tokensAtNewPos = GooseLudo.state.tokens.filter(
        (t) => t.position === newPos
    );

    // If 2+ pieces at destination (barrier)
    if (tokensAtNewPos.length >= 2) {
        // Can only land if it's own barrier (all pieces same color)
        const ownPieces = tokensAtNewPos.filter((t) => t.player === playerTurn);
        if (ownPieces.length !== tokensAtNewPos.length) {
            // Barrier belongs to opponent
            return false;
        }
    }

    return true;
};

const movablePieces = function (playerTurn, diceResults) {
    const moveDistance = diceResults[0] + diceResults[1];
    const playerTokens = GooseLudo.state.tokens.filter(
        (t) => t.player === playerTurn
    );

    // Filter pieces that can move
    return playerTokens.filter((piece) => {
        if (piece.waitTurns > 0) {
            return false;
        }

        // Pieces at home need a 5
        if (piece.position === "home") {
            return diceResults.includes(5);
        }

        // Pieces on board - check if destination is valid
        const newPos = piece.position + moveDistance;
        return canMoveTo(playerTurn, piece, newPos);
    });
};

GooseLudo.getMovablePieces = function (playerTurn, diceResults) {
    return movablePieces(playerTurn, diceResults);
};

const checkCapture = function (playerTurn, piece, newPos) {
    // Find opponent pieces at newPos
    const opponentPieces = GooseLudo.state.tokens.filter(
        (t) => t.position === newPos && t.player !== playerTurn
    );

    // If landing on opponent piece
    if (opponentPieces.length > 0) {
        // Check if square is safe
        if (safeSquares.includes(newPos)) {
            // Safe square - can't capture
            return;
        }

        // Check if it's a barrier (2+ opponent pieces)
        const allTokensAtPos = GooseLudo.state.tokens.filter(
            (t) => t.position === newPos
        );
        if (allTokensAtPos.length >= 2) {
            // Barrier - can't capture
            return;
        }

        // Capture: send opponent piece back home
        opponentPieces.forEach((oppPiece) => {
            oppPiece.position = "home";
        });
    }
};

/**
 * Moves a token according to the supplied dice values.
 *
 * If a token is at home and a 5 is available, it leaves home.
 * Captures are resolved before movement is completed.
 *
 * @memberof GooseLudo
 * @function move
 * @param {string} playerTurn - Active player's colour.
 * @param {GooseLudo.Piece} piece - Token being moved.
 * @param {number[]} diceResults - Values available to spend.
 * @returns {undefined|number|[number, number[]]}
 * Returns nothing when leaving home,
 * current position if movement is blocked,
 * or new position and remaining dice.
 */

GooseLudo.move = function (playerTurn, piece, diceResults) {
    if (piece.position === "home" && diceResults.includes(5)) {
        const fives = diceResults.filter((die) => die === 5);
        fives.forEach((five) => leaveHome(playerTurn, piece, diceResults));
        return [piece.position, diceResults];
    }

    const moveDistance = diceResults[0] + diceResults[1];

    if (piece.position === "home") {
        // Can't move if at home and no 5 rolled
        return [piece.position, diceResults];
    }

    const newPos = piece.position + moveDistance;
    const movePossible = canMoveTo(playerTurn, piece, newPos);
    if (!movePossible) {
        return [piece.position, diceResults]; // no move
    }

    checkCapture(playerTurn, piece, newPos);

    GooseLudo.state.lastPieceMoved = piece;

    piece.position = newPos;

    const updatedDiceResults = [0, 0]; // all dice used up
    return [newPos, updatedDiceResults];
};

/**
 * Applies special square effects after movement.
 *
 * Handles:
 * - Bridge teleportation
 * - Dice-square teleportation
 * - Well penalties
 * - Barrier creation/removal
 * - End-zone entry
 *
 * @memberof GooseLudo
 * @function squareEffects
 * @param {string} playerTurn - Active player's colour.
 * @param {GooseLudo.Piece} piece - Token affected.
 * @param {number} newPos - Position reached after movement.
 * @returns {void}
 */

GooseLudo.squareEffects = function (playerTurn, piece, newPos) {
    // Bridge squares: instant teleport from first bridge to second bridge
    const bridge = bridgeSquares.find((b) => b.from === newPos);
    if (bridge) {
        piece.position = bridge.to;
        checkCapture(playerTurn, piece, bridge.to);
        newPos = bridge.to;
    }

    // Dice squares: go to the other dice square
    if (diceSquares.includes(newPos)) {
        const otherDiceSquare = diceSquares.find((sq) => sq !== newPos);
        if (otherDiceSquare !== undefined) {
            piece.position = otherDiceSquare;
            checkCapture(playerTurn, piece, otherDiceSquare);
            newPos = otherDiceSquare;
        }
    }

    // Well square: piece can't move for two turns
    if (newPos === wellSquare) {
        piece.waitTurns = 2;
    }

    // Check if creating a barrier (landing on own piece)
    const tokensAtPos = GooseLudo.state.tokens.filter(
        (t) => t.position === newPos && t.player === playerTurn
    );

    if (tokensAtPos.length >= 2) {
        // Barrier created - mark pieces as in barrier
        tokensAtPos.forEach((t) => {
            t.inBarrier = true;
        });
    }

    // Clear barrier state for pieces that are no longer on a barrier square
    GooseLudo.state.tokens.forEach((t) => {
        const samePosTokens = GooseLudo.state.tokens.filter((other) =>
            other.position === t.position);
        if (samePosTokens.length < 2) {
            t.inBarrier = false;
        }
    });

    // Check if moved into end zone and handle transition - edit
    if (newPos > mainPathLength) {
        piece.position = "end";
    }
};

/**
 * Executes a complete player turn.
 *
 * Decrements waiting penalties, performs dice rolls,
 * processes rerolls, and attempts token movement.
 *
 * @memberof GooseLudo
 * @function playersTurn
 * @returns {void}
 */

GooseLudo.playersTurn = function () {
    const currentPlayer = GooseLudo.playerList[GooseLudo.state.currentPlayer];

    GooseLudo.state.tokens.forEach((piece) => {
        if (piece.player === currentPlayer && piece.waitTurns > 0) {
            piece.waitTurns -= 1;
        }
    });

    let rolls = 0;
    let reroll = true;
    while (reroll && rolls < 3) {
        const [diceResults, updatedRolls, updatedReroll] = GooseLudo.roll(
            currentPlayer, rolls, reroll
        );
        rolls = updatedRolls;
        reroll = updatedReroll;

        // choose piece to move - define piece
        const pieceToMove = null; // TODO: implement piece selection logic
        if (pieceToMove) {
            const [newPos, updatedDiceResults] = GooseLudo.move(
                currentPlayer, pieceToMove, diceResults);
            GooseLudo.squareEffects(currentPlayer, pieceToMove, newPos);
        }
    }

    GooseLudo.playerNext(GooseLudo.state.currentPlayer);
};

/**
 * Determines whether any player has won the game.
 *
 * A player wins when all of their tokens have reached the end zone.
 *
 * @memberof GooseLudo
 * @function isVictory
 * @returns {boolean} True if a player has won.
 */

GooseLudo.isVictory = function () {
    // is there any player who has all their tokens in the end zone?
    return GooseLudo.playerList.some(function (p) {
        const playerTokens = GooseLudo.state.tokens.filter(
            (token) => token.player === p
        );
        return playerTokens.length > 0 && playerTokens.every(
            (token) => token.position === "end"
        );
    });
};



export default Object.freeze(GooseLudo);