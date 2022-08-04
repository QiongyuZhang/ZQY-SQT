import Tetris from "../common/Tetris.js";

const grid_columns = Tetris.field_width;
const grid_rows = Tetris.field_height;
console.log(Tetris)
let game = Tetris.new_game();
let { next_tetromino } = game
let left = document.getElementsByClassName('left')[0];
let right = document.getElementsByClassName('right')[0];
// initialize                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

function render(data, left) {
    data = JSON.parse(JSON.stringify(data))
    left.innerHTML = ``;
    ([
        [0, 0, 0, 0, 0, 0],
        ...(data.grid.map(e => {
            e.unshift(0)
            if (e.length !== 6) {
                for (let i = 0; i < 7 - e.length; i++) {
                    e.push(0)
                }
            }
            return e;
        })),
        [0, 0, 0, 0, 0, 0],
    ]).map(e => {
        const row = document.createElement("div");
        row.className = "rows";
        left.append(row)
        e.map(e => {
            const cell = document.createElement("div");
            cell.className = "cells " + e;

            row.append(cell);

            return cell;
            console.log(e)
        })
    })
}

render(next_tetromino, left)



document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

const grid = document.getElementById("grid");
const clones = (next_tetromino) => JSON.parse(JSON.stringify(next_tetromino));
let oldNext = clones(next_tetromino);


const range = (n) => Array.from({ "length": n }, (ignore, k) => k);

const cells = range(grid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(grid_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    grid.append(row);
    return rows;
});

const update_grid = function () {

    game.field.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = cells[line_index][column_index];
            cell.className = `cell ${block}`;
        });
    });
    Tetris.tetromino_coordiates(game.current_tetromino, game.position).forEach(
        function (coord) {
            try {
                const cell = cells[coord[1]][coord[0]];
                cell.className = (
                    `cell current ${game.current_tetromino.block_type}`
                );
            } catch (ignore) {

            }
        }
    );
};

// Don't allow the player to hold down the rotate key.
let key_locked = false;

document.body.onkeyup = function () {
    key_locked = false;
};

document.body.onkeydown = function (event) {
    if (!key_locked && event.key === "ArrowUp") {
        key_locked = true;
        game = Tetris.rotate_ccw(game);
    }
    if (event.key === "ArrowDown") {
        game = Tetris.soft_drop(game);
    }
    if (event.key === "ArrowLeft") {
        game = Tetris.left(game);
    }
    if (event.key === "ArrowRight") {
        game = Tetris.right(game);
    }
    if (event.key === " ") {
        game = Tetris.hard_drop(game);
    }
    update_grid();
};
const timer_function = function () {
    game = Tetris.next_turn(game);
    if (oldNext.block_type !== game.next_tetromino.block_type) {
        oldNext = clones(game.next_tetromino)
        render(oldNext, left)
    }
    update_grid();
    setTimeout(timer_function, 500);
};
setTimeout(timer_function, 500);
update_grid();
document.addEventListener('keydown', (e) => {
    if (e.code == 'KeyC') {
        game = game.hold(game)
        // console.log(game.held_tetromino)
        render(game.held_tetromino, right)
    }
})