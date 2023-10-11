import { useCallback, useEffect, useState, useMemo } from 'preact/hooks'
import { makepuzzle, solvepuzzle, } from 'sudoku'
import Grid from './components/Grid'
import Highlighters from './components/Highlighters'
import BoardContext from './context/BoardContext'
import './app.css'

const countFreeCells = (board) => {
  let n = 0
  board.forEach(row => {
    row.forEach(cell => {
      if (cell.value === null)
        n += 1
    })
  })
  return n
}

export function App() {
  const [board, setBoard] = useState()
  const [originalBoard, setOriginalBoard] = useState()
  const [focusedCell, setFocusedCell] = useState()
  const [highlighted, setHighlighted] = useState()
  const [errors, setErrors] = useState([])
  const solution = useMemo(() => {
    if (originalBoard) {
      return solvepuzzle(originalBoard)
    }
    return null
  }, [originalBoard])

  const refreshBoard = useCallback(() => {
    const newPuzzle = makepuzzle()
    const flatBoard = newPuzzle.map(cell => {
      return {
        value: cell !== null ? cell + 1 : cell,
        initial: cell !== null
      }
    })
    const board = []
    while (flatBoard.length > 0) {
      board.push(flatBoard.splice(0, 9))
    }
    setBoard(board)
    setOriginalBoard(newPuzzle)
  }, [])

  const focus = useCallback((x, y) => {
    setFocusedCell({ x, y })
  }, [])

  const isFocused = useCallback((x, y) => {
    return focusedCell && focusedCell.x === x && focusedCell.y === y
  }, [focusedCell])

  const setCell = useCallback((num) => {
    if (!focusedCell)
      return
    setBoard(prev => prev.map((row, rowIndex) => {
      if (focusedCell.y !== rowIndex) {
        return row
      } else {
        return row.map((cell, cellIndex) => {
          if (focusedCell.x !== cellIndex) {
            return cell
          } else {
            return {
              value: num,
              initial: false
            }
          }
        })
      }
    }))
  }, [focusedCell])

  const moveFocus = useCallback((direction) => {
    var moveOffset = {
      'ArrowRight': { x: 1, y: 0 },
      'ArrowLeft': { x: -1, y: 0 },
      'ArrowUp': { x: 0, y: -1 },
      'ArrowDown': { x: 0, y: 1 },
    }
    var { x, y } = focusedCell
    x += moveOffset[direction].x
    y += moveOffset[direction].y
    while (x >= 0 && x <= 8 && y >= 0 && y <= 8) {
      if (!board[y][x].initial) {
        focus(x, y)
        return
      }
      x += moveOffset[direction].x
      y += moveOffset[direction].y
    }
  }, [focusedCell, board])

  useEffect(() => {
    const onKeyDown = (e) => {
      if ('123456789'.includes(e.key)) {
        setCell(Number(e.key))
      } else if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        moveFocus(e.key)
      } else if (e.key === 'Delete') {
        setCell(null)
      } else if (e.key === 'Escape') {
        setFocusedCell(undefined)
        setHighlighted(undefined)
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [setCell, moveFocus])

  useEffect(() => {
    refreshBoard()
  }, [refreshBoard])

  useEffect(() => {
    if (!board)
      return

    const checkValid = (board, solution) => {
      const errors = []
      let flatBoard = []
      board.forEach(row => {
        flatBoard = [...flatBoard, ...row]
      })
      for (let i = 0; i < flatBoard.length && i < solution.length; i++) {
        if (flatBoard[i].value !== solution[i] + 1)
          errors.push({y: Math.floor(i / 9), x: i%9, expectedValue: solution[i], value: flatBoard[i].value})
      }
      setErrors(errors)
      console.log(errors)
      return true
    }

    const freeCells = countFreeCells(board)
    if (freeCells === 0) {
      const valid = checkValid(board, solution)
      if (valid) {
        console.log('Solved!')
      } else {
        console.log('Try again')
      }
    }
  }, [board])

  return <BoardContext.Provider value={{ board, focus, isFocused, highlighted, highlight: setHighlighted, errors }}>
    {board && <>
      <Grid />
      <Highlighters />
    </>}
  </BoardContext.Provider>
}
