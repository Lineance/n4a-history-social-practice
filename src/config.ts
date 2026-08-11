/** 站点全局配置。Giscus 评论区（见 docs/技术方案.md §6）。
 *  repoId 为仓库 GraphQL node_id；category/categoryId 来自 giscus.app。 */
export const giscus = {
  repo: 'Lineance/n4a-history-social-practice',
  repoId: 'R_kgDOT1OnoA',
  category: 'Announcements',
  categoryId: 'DIC_kwDOT1OnoM4DDJHS',
}

/** 天地图底图 key（客户端 key；生产由 GitHub Actions Secret 注入，见 .env.example） */
export const tiandituTk = import.meta.env.VITE_TIANDITU_TK ?? ''
