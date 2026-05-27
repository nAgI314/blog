import styles from './index.module.scss'
import { useId, useState, useRef, useEffect } from 'react'
import { useTheme } from '../../theme'

export function Ebi() {
  const [activeTab, setActiveTab] = useState<'ebi' | 'kamera'>('kamera')
  const tabsId = useId()
  const ebiTabId = `${tabsId}-tab-ebi`
  const kameraTabId = `${tabsId}-tab-kamera`
  const ebiPanelId = `${tabsId}-panel-ebi`
  const kameraPanelId = `${tabsId}-panel-kamera`
  const { lightsOff } = useTheme()

  const ebiWrapRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number | null>(null)

  function getRotationDeg(el: HTMLElement): number | null {
    const transform = getComputedStyle(el).transform
    if (!transform || transform === 'none') return 0

    try {
      const m = new DOMMatrixReadOnly(transform)
      const angle = (Math.atan2(m.b, m.a) * 180) / Math.PI
      return Number.isFinite(angle) ? angle : null
    } catch {
      const match = transform.match(/^matrix\\(([-0-9.,\\s]+)\\)$/)
      if (!match) return null
      const parts = match[1].split(',').map((s) => Number(s.trim()))
      if (parts.length < 2 || parts.some((n) => !Number.isFinite(n))) return null
      const [a, b] = parts
      const angle = (Math.atan2(b, a) * 180) / Math.PI
      return Number.isFinite(angle) ? angle : null
    }
  }

  // カメラSVG内でのカメラレンズの向き（SVG座標系での角度、0=右）
  // 実際のSVGに合わせて調整してください
  // ここを触ると「ライトの向き」と「カメラ位置ずれ」を微調整できます
  const ROTATION_DURATION_MS = 6000 // CSS(.ebiWrap)と揃える
  const ROTATION_SIGN: 1 | -1 = -1 // 逆回転なら 1 にする
  const CAMERA_DIRECTION_DEG =200 // SVG上の「カメラが向いてる」基準角（要調整）
  const CAMERA_AIM_OFFSET_DEG = 10 // さらに微調整（例: -8 とか）
  const SPOT_WIDTH_DEG = 55 // 光の広がり
  const CAMERA_OFFSET_LOCAL_PX = { x: -45, y: 10 } // レンズ位置オフセット（px, 要素中心基準・回転に追従）

  useEffect(() => {
    if (!lightsOff || activeTab !== 'kamera') {
      cancelAnimationFrame(rafRef.current)
      document.documentElement.dataset.spot = 'off'
      return
    }

    document.documentElement.dataset.spot = 'on'

    function tick(timestamp: number) {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      // CSS側が反時計回り（CCW）なので符号を合わせる
    //   const rotationDeg = ROTATION_SIGN * (elapsed / ROTATION_DURATION_MS) * 360

      const wrap = ebiWrapRef.current
      
      let rotationDeg =
  ROTATION_SIGN * (elapsed / ROTATION_DURATION_MS) * 360

if (wrap) {
  const actual = getRotationDeg(wrap)
  if (actual !== null) {
    rotationDeg = actual
     * ROTATION_SIGN
  }
}
      
      if (wrap) {
        const rect = wrap.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2

        // 回転中心はそのまま、レンズ位置(ローカルオフセット)だけ回転に追従させる
        const rad = (-rotationDeg * Math.PI) / 180
        const offsetX = CAMERA_OFFSET_LOCAL_PX.x * Math.cos(rad) - CAMERA_OFFSET_LOCAL_PX.y * Math.sin(rad)
        const offsetY = CAMERA_OFFSET_LOCAL_PX.x * Math.sin(rad) + CAMERA_OFFSET_LOCAL_PX.y * Math.cos(rad)
        const spotX = cx + offsetX
        const spotY = cy + offsetY

        // カメラが向いている絶対角度（画面座標系）
        // conic-gradient の角度基準は「上（12時）= 0deg、時計回りが正」
        // カメラ向き = 回転角 + SVG内でのカメラ向き
        // 数学角度 → CSS conic角度: conic = 90 - math
        const mathAngle = rotationDeg + CAMERA_DIRECTION_DEG + CAMERA_AIM_OFFSET_DEG
        const conicAngle = 90 - mathAngle

        // スポットライトの広がり
        const spotWidth = SPOT_WIDTH_DEG
        // conic-gradient は「from X」で開始角を指定するので、
        // 中心を conicAngle にするため spotWidth/2 だけ前にずらす
        const fromAngle = conicAngle - spotWidth / 2

        document.documentElement.style.setProperty('--spot-x', `${spotX}px`)
        document.documentElement.style.setProperty('--spot-y', `${spotY}px`)
        document.documentElement.style.setProperty('--spot-angle', `${fromAngle}deg`)
        document.documentElement.style.setProperty('--spot-width', `${spotWidth}deg`)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    startTimeRef.current = null
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.documentElement.dataset.spot = 'off'
    }
  }, [lightsOff, activeTab])

  return (
    <div className={styles.page}>
      <h1>Ebi</h1>

      <div className={styles.tabs} role="tablist" aria-label="Ebi tabs">
        <button
          type="button"
          id={ebiTabId}
          className={activeTab === 'ebi' ? styles.tabActive : styles.tab}
          role="tab"
          aria-selected={activeTab === 'ebi'}
          aria-controls={ebiPanelId}
          tabIndex={activeTab === 'ebi' ? 0 : -1}
          onClick={() => setActiveTab('ebi')}
        >
          エビ
        </button>
        <button
          type="button"
          id={kameraTabId}
          className={activeTab === 'kamera' ? styles.tabActive : styles.tab}
          role="tab"
          aria-selected={activeTab === 'kamera'}
          aria-controls={kameraPanelId}
          tabIndex={activeTab === 'kamera' ? 0 : -1}
          onClick={() => setActiveTab('kamera')}
        >
          エビカメラ
        </button>
      </div>

      {activeTab === 'ebi' ? (
        <div
          id={ebiPanelId}
          className={styles.panel}
          role="tabpanel"
          aria-labelledby={ebiTabId}
        >
          <div className={styles.ebiWrap}>
            <img className={styles.ebiImg} src="/osechi_logo_ebi_marui.svg" alt="Ebi Logo" />
          </div>
        </div>
      ) : (
        <div
          id={kameraPanelId}
          className={styles.panel}
          role="tabpanel"
          aria-labelledby={kameraTabId}
        >
          <div ref={ebiWrapRef} className={styles.ebiWrap}>
            <img className={styles.ebiImg} src="/osechi_logo_kamera_ariy.svg" alt="Kamera Aiy Logo" />
          </div>
        </div>
      )}
    </div>
  )
}
