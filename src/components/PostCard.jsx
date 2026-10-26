function PostCard({ post, onView, onDelete, isDeleting }) {
  return (
    <article className="post-card">
      <h2>{post.title}</h2>
      <div className="tags">
        {post.tags?.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <p className="post-stats">
        <span aria-label="likes">♥ {post.reactions?.likes ?? 0}</span>
        <span aria-label="dislikes">· {post.reactions?.dislikes ?? 0}</span>
      </p>
      <div className="post-actions">
        <button type="button" className="secondary-button" onClick={() => onView(post)}>
          View
        </button>
        <button
          type="button"
          className="danger-button"
          onClick={() => onDelete(post)}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </article>
  )
}

export default PostCard
