import { type SNSsource } from "../Footer"
import styles from './index.module.scss'

export function SNS (source: SNSsource) {
  return (
    <div>
      <a href={source.href} target="_blank" rel="noopener noreferrer" className={styles.snsLink}>
        <img src={source.icon} alt={source.alt}/>
        <span>{source.name}</span>
      </a>
    </div>
  )
}