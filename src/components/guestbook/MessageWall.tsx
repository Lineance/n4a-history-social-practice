import { useState, type FormEvent } from 'react'
import { testimonialTexts } from '../../lib/content'
import { addLocalMessage, loadLocalMessages, type LocalMessage } from '../../lib/localMessages'
import styles from './MessageWall.module.css'

const MAX_LEN = 200

function formatTime(t: number): string {
  if (!t) return ''
  const d = new Date(t)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function MessageWall() {
  const [messages, setMessages] = useState<LocalMessage[]>(() => loadLocalMessages())
  const [input, setInput] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setMessages(addLocalMessage(text))
    setInput('')
  }

  return (
    <section className={styles.wall}>
      <h2 className={styles.sectionTitle}>铁军寄语</h2>
      <div className={styles.preset}>
        {testimonialTexts.map((t, i) => (
          <blockquote key={i} className={styles.presetItem}>
            “{t}”
          </blockquote>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>访客留言</h2>
      <form className={styles.form} onSubmit={submit}>
        <textarea
          className={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_LEN))}
          placeholder="写下你对铁军精神的感悟…"
          rows={3}
          maxLength={MAX_LEN}
        />
        <div className={styles.formFoot}>
          <span className={styles.count}>
            {input.length}/{MAX_LEN}
          </span>
          <button type="submit" className={styles.submit} disabled={!input.trim()}>
            提交留言
          </button>
        </div>
      </form>

      {messages.length === 0 ? (
        <p className={styles.empty}>还没有访客留言，来写下第一条吧。</p>
      ) : (
        <ul className={styles.list}>
          {messages.map((m) => (
            <li key={m.id} className={styles.item}>
              <p className={styles.itemContent}>{m.content}</p>
              <span className={styles.itemTime}>{formatTime(m.time)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default MessageWall
