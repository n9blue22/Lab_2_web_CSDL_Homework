import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import PostDetails from '../components/PostDetails'
import PostForm from '../components/PostForm'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import { useDebounce } from '../hooks/useDebounce'
import {
  addPost,
  deletePost,
  getPostComments,
  getPosts,
  searchPosts,
} from '../services/postsApi'

const PAGE_SIZE = 10
const DELETED_POSTS_KEY = 'mini-blog-manager-deleted-post-ids'

function readDeletedPostIds() {
  const savedIds = window.localStorage.getItem(DELETED_POSTS_KEY)
  if (!savedIds) return []

  try {
    const parsedIds = JSON.parse(savedIds)
    return Array.isArray(parsedIds) ? parsedIds : []
  } catch {
    window.localStorage.removeItem(DELETED_POSTS_KEY)
    return []
  }
}

function BlogManagerPage() {
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [deletedPostIds, setDeletedPostIds] = useState(readDeletedPostIds)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let active = true
    async function loadPosts() {
      setError('')
      if (debouncedQuery.trim()) {
        setIsSearching(true)
      } else {
        setIsLoading(true)
      }

      try {
        const result = debouncedQuery.trim()
          ? await searchPosts(debouncedQuery.trim())
          : await getPosts(0, 0)
        if (active) {
          const visiblePosts = (result.posts ?? []).filter(
            (post) => !deletedPostIds.includes(post.id),
          )
          const postsForPage = debouncedQuery.trim()
            ? visiblePosts
            : visiblePosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
          setPosts(postsForPage)
          setTotal(visiblePosts.length)
          if (!debouncedQuery.trim()) {
            const lastPage = Math.max(1, Math.ceil(visiblePosts.length / PAGE_SIZE))
            if (page > lastPage) setPage(lastPage)
          }
        }
      } catch (requestError) {
        if (active) setError(requestError.message || 'Unable to load posts.')
      } finally {
        if (active) {
          setIsLoading(false)
          setIsSearching(false)
        }
      }
    }

    loadPosts()
    return () => {
      active = false
    }
  }, [debouncedQuery, deletedPostIds, page])

  async function handleView(post) {
    setSelectedPost(post)
    setComments([])
    setCommentsLoading(true)
    try {
      const result = await getPostComments(post.id)
      setComments(result.comments ?? [])
    } catch (requestError) {
      setError(requestError.message || 'Unable to load comments.')
    } finally {
      setCommentsLoading(false)
    }
  }

  async function handleAdd(post) {
    setIsSubmitting(true)
    setError('')
    try {
      const created = await addPost(post)
      setDeletedPostIds((current) => {
        const nextIds = current.filter((id) => id !== created.id)
        window.localStorage.setItem(DELETED_POSTS_KEY, JSON.stringify(nextIds))
        return nextIds
      })
      setPosts((current) => [created, ...current.filter((item) => item.id !== created.id)])
      setTotal((current) => current + 1)
      return true
    } catch (requestError) {
      setError(requestError.message || 'Unable to add post.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(post) {
    if (!window.confirm(`Delete "${post.title}"?`)) return
    setDeletingId(post.id)
    setError('')
    try {
      const deleted = await deletePost(post.id)
      if (deleted.isDeleted) {
        setDeletedPostIds((current) => {
          const nextIds = current.includes(post.id) ? current : [...current, post.id]
          window.localStorage.setItem(DELETED_POSTS_KEY, JSON.stringify(nextIds))
          return nextIds
        })
        setPosts((current) => current.filter((item) => item.id !== post.id))
        setTotal((current) => Math.max(0, current - 1))
      }
    } catch (requestError) {
      setError(requestError.message || 'Unable to delete post.')
    } finally {
      setDeletingId(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const isBusy = isLoading && !posts.length

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Content workspace</p>
        <h1>Mini Blog Manager</h1>
        <p>Manage blog posts from DummyJSON with a simple, responsive interface.</p>
      </header>

      <PostForm onAdd={handleAdd} isSubmitting={isSubmitting} />
      <SearchBar value={query} onChange={(value) => { setQuery(value); setPage(1) }} isSearching={isSearching} />

      {error && <p className="error-message" role="alert">{error}</p>}
      {isBusy ? (
        <p className="loading-message" role="status">Loading posts...</p>
      ) : posts.length ? (
        <section className="posts-section" aria-live="polite">
          <div className="posts-heading">
            <h2>{debouncedQuery.trim() ? `Search results for "${debouncedQuery}"` : 'Latest posts'}</h2>
            <span>{posts.length} posts</span>
          </div>
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onView={handleView}
                onDelete={handleDelete}
                isDeleting={deletingId === post.id}
              />
            ))}
          </div>
          {!debouncedQuery.trim() && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrevious={() => setPage((current) => current - 1)}
              onNext={() => setPage((current) => current + 1)}
              disabled={isLoading}
            />
          )}
        </section>
      ) : (
        <p className="empty-message">No posts found.</p>
      )}

      {selectedPost && (
        <PostDetails
          post={selectedPost}
          comments={comments}
          isLoading={commentsLoading}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </main>
  )
}

export default BlogManagerPage
