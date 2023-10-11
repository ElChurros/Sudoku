import { useContext } from 'preact/hooks'
import BoardContext from '../../context/BoardContext'
import styles from './highlighters.module.css'

const Highlighters = () => {
    const ctx = useContext(BoardContext)
    return <div class={styles.highlighters}>
        {[...Array(9).keys()].map(n =>
            <button onClick={() => ctx.highlight(n+1)}>{n + 1}</button>
        )}
    </div>
}

export default Highlighters