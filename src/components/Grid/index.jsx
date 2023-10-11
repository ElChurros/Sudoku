import { useContext } from "preact/hooks"
import BoardContext from "../../context/BoardContext"
import styles from './grid.module.css'
import Cell from "./Cell"

const Grid = () => {
    const ctx = useContext(BoardContext)
    return <div class={styles.grid}>
        {ctx.board.map((row, y) => 
            <div class={styles.row}>
                {row.map((cell, x) => 
                    <Cell {...cell} x={x} y={y} error={ctx.errors.find(e => e.x === x && e.y === y)}/>
                )}
            </div>
        )}
    </div>
}

export default Grid