const checkRow = (grid, cell, num) => {
    return grid[cell.y].indexOf(num) === -1
}

const checkCol = (grid, cell, num) => {
    return !grid.some(row => row[cell.x] === num)
}

const checkRegion = (grid, cell, num) => {
    const boxStart = {
        x: cell.x - (cell.x % 3),
        y: cell.y - (cell.y % 3),
    }
    for (y of [0, 1, 2]) {
        for (x of [0, 1, 2]) {
            if (grid[boxStart.y + y][boxStart.x + x] === num)
                return false
        }
    }
    return true
}

export const checkSafe = (grid, cell, num) => {
    return checkRow(grid, cell, num) && checkCol(grid, cell, num) && checkRegion(grid, cell, num)
}