import { useEffect, useRef } from 'react'
import { giscus } from '../../config'

function GiscusEmbed() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!giscus.repo || !el) return
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.setAttribute('data-repo', giscus.repo)
    script.setAttribute('data-repo-id', giscus.repoId)
    script.setAttribute('data-category', giscus.category)
    script.setAttribute('data-category-id', giscus.categoryId)
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-theme', 'light')
    script.setAttribute('data-lang', 'zh-CN')
    el.appendChild(script)

    return () => {
      el.querySelectorAll('script').forEach((s) => s.remove())
    }
  }, [])

  return <div ref={ref} />
}

export default GiscusEmbed
