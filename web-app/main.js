import R from "./ramda.js";
import GooseLudo from "./GooseLudo.js";

// table things, stuff for the UI
const row_count = 20;
const column_count = 20;

document.documentElement.style.setProperty("--row-count", row_count);
document.documentElement.style.setProperty("--column-count", column_count);

const game_grid = document.getElementById("game_board");

R.range(0, row_count).forEach(function (row_index) {
    const tr = document.createElement("tr");
    game_grid.append(tr);

    R.range(0, column_count).forEach(function (column_index) {
        const td = document.createElement("td");
        tr.append(td);
        td.textContent = `[${row_index}, ${column_index}]`;

        td.onclick = function () {
            document.querySelector("aside").textContent = (
                `Row: ${row_index}, Column: ${column_index}`
            );
        };
    });
});