import R from "./ramda.js";

/**
 * @namespace OcaParchis
 */
const OcaParchis = {};

/* Spanish parchis terms
- casilla = square
- seguro = safe
- casa = home
- meta = end zone
- llegada = arrival
*/

const numCasillas = 68;
const casillasSeguras = [5, 12, 17, 22, 29, 34, 39, 46, 51, 56, 63, 68];
const casillasCasa = [5, 22, 39, 56];
const casillasMetaLlegada = 7;
const colours = ["yellow", "blue", "red", "green"];
OcaParchis.playerList = [];
OcaParchis.tokens = [];

const setSquareTypes = function (square, i) {
    square.id = i;
    square.x = 0;
    square.y = 0;
    if (casillasSeguras.includes(i)) {
        square.type = "safe";
    }
    if (casillasCasa.includes(i)) {
        // map the home square to a player index based on order in casillasCasa
        square.colour = Object.keys(OcaParchis.playerList)[casillasCasa.indexOf(i)];
        square.type = "home";
    }
};

const endZoneSquares = function () {
};

const createTokens = function (players) {
    R.forEach(players, function (player) {
        R.concat(
            R.repeat({
                player: players[player],
                position: "home"
            }, 4),
            OcaParchis.tokens
        );
    });
};

OcaParchis.startingBoard = function () {
    OcaParchis.boardSquares = R.repeat({
        id: null,
        type: "track",
        colour: "white",
        x: 0,
        y: 0
    }, numCasillas);

    // Note: squares are 1-based in casillas arrays, keep id consistent
    OcaParchis.boardSquares.forEach((sq, i) => setSquareTypes(sq, i));

    createTokens(OcaParchis.playerList);

    endZoneSquares();
};


// whos turn
// - on first turn everyone rolls to figure this out

const determineFirstPlayer = function () {
};

OcaParchis.playerNext = function () {

};


// roll - always two dice
// - if 5 and pieces in home then release piece
// - if all pieces are out of house then 6 = seven
// - if you roll a 6 and have a barrier, you break the barrier
// - if both die have same number then roll again hasta tres vezes
// - if you roll a six roll again up to three times

OcaParchis.roll = function (playerTurn) {
    const diceResults = [];
    let rolls = 0;
    let reroll = true;

    while (reroll && rolls < 3) {
        rolls += 1;
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        diceResults.push(d1, d2);

        // extra roll if any die is 6 or both dice are equal (double)
        reroll = (d1 === d2) || d1 === 6 || d2 === 6;
        // if we've reached 3 rolls stop regardless
    }

    // If player provided and all their pieces are out of home, treat 6 as 7
    if (playerTurn) {
        const playerTokens = OcaParchis.tokens.filter(
            (t) => t.player === playerTurn
        );
        const anyAtHome = playerTokens.some((t) => t.position === "home");
        if (!anyAtHome) {
            R.forEach(function (die, i) {
                if (die === 6) { diceResults[i] = 7; }
            }, diceResults);
        }
    }

    return diceResults;
};

// move
// - pick piece and move
// - if land on different players piece then send that piece back to home
// - if land on different players piece and its safety then no eating
// - if land on seguro that piece cant be eaten
//      else can be eaten
// - if land on square with own piece create barrera
// - if will land on piece with any two pieces then cant move there
const leaveHome = function (playerTurn, piece, diceResults) {
    piece.position = casillasCasa.indexOf(playerTurn); // playerTurn = int
    diceResults.splice(diceResults.indexOf(5), 1); // removes first 5
};

OcaParchis.move = function (playerTurn, piece, diceResults) {
    if (piece.position === "home" && diceResults.includes(5)) {
        const fives = diceResults.filter((die) => die === 5);
        fives.forEach((five) => leaveHome(playerTurn, piece, diceResults));
        return;
    }

    const moveDistance = diceResults.reduce(
        (dieOne, dieTwo) => dieOne + dieTwo,
        0
    );

    piece.position += moveDistance;
    return;
};

OcaParchis.isVictory = function () {
    // is there any player who has all their tokens in the end zone?
    return OcaParchis.playerList.some(function (p) {
        const playerTokens = OcaParchis.tokens.filter(
            (token) => token.player === p
        );
        return playerTokens.length > 0 && playerTokens.every(
            (token) => token.position === "end"
        );
    });
};


export default Object.freeze(OcaParchis);