import { useContext } from 'preact/hooks'
import BoardContext from '../../../context/BoardContext'
import styles from './cell.module.css'

const Cell = ({ initial, value, x, y, error }) => {
    const ctx = useContext(BoardContext)

    return <div onClick={() => !initial && ctx.focus(x, y)} class={`${styles.cell} ${!initial ? styles.proposal : ''} ${ctx.isFocused(x, y) ? styles.focused : ''} ${ctx.highlighted && ctx.highlighted === value ? styles.highlighted : ''} ${error ? styles.error : ''}`}>
        {value !== null ? value : ''}
    </div>
}

export default Cell