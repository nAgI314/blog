import { SNS } from "../SNS"
import styles from './index.module.scss'


export type SNSsource = {
  name: string
  href: string
  icon: string
  alt: string
}

const SNSsources = [
  {
    name: 'X',
    href: 'https://x.com/nagi_kinwagiwa',
    icon: '/sns/x-social-media-round-icon.svg',
    alt: 'X',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/nAgI314',
    icon: '/sns/github-icon.svg',
    alt: 'GitHub',
  },
  {
    name: 'Youtube',
    href: 'https://www.youtube.com/@minagiri-channel',
    icon: '/sns/youtube-color-icon.svg',
    alt: 'Youtube',
  },
  {
    name: 'Email',
    href: 'mailto:nagi@minagiri.net',
    icon: '/sns/envelope-line-icon.svg',
    alt: 'Email',
  }

]

export function Footer() {
  return (
    <footer className="appFooter">
        <section className={styles.snsLinks}>
        {SNSsources.map((source) => (
            <SNS key={source.name} {...source} />
        ))}
        </section>
    </footer>
  )
}