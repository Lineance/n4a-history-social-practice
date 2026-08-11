import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section style={{ textAlign: 'center', padding: '100px 0' }}>
      <h1>404</h1>
      <p>页面不存在。</p>
      <Link to="/">返回首页</Link>
    </section>
  )
}

export default NotFound
