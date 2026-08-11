import { testimonialTexts } from './content'

const KEY = 'n4a_messages'
const MAX = 50

export interface LocalMessage {
  id: string
  content: string
  time: number
}

export function loadLocalMessages(): LocalMessage[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (m): m is LocalMessage =>
          typeof m === 'object' &&
          m !== null &&
          typeof (m as LocalMessage).id === 'string' &&
          typeof (m as LocalMessage).content === 'string' &&
          typeof (m as LocalMessage).time === 'number',
      )
      .slice(0, MAX)
  } catch {
    return []
  }
}

export function saveLocalMessages(list: LocalMessage[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)))
  } catch {
    // 隐私模式/配额不足时静默忽略
  }
}

export function addLocalMessage(content: string): LocalMessage[] {
  const next: LocalMessage = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    content: content.trim(),
    time: Date.now(),
  }
  const list = [next, ...loadLocalMessages()].slice(0, MAX)
  saveLocalMessages(list)
  return list
}

/** 本地留言 + 预置文案 合并（本地优先，供地图弹幕展示） */
export function allMessageTexts(): string[] {
  const local = loadLocalMessages().map((m) => m.content)
  return [...local, ...testimonialTexts]
}
