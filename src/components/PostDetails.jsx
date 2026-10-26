function PostDetails({ post, comments, isLoading, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="close-button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 id="details-title">{post.title}</h2>
        <p className="details-body">{post.body}</p>
        <h3>Comments</h3>
        {isLoading ? (
          <p>Loading comments...</p>
        ) : comments.length ? (
          <ul className="comments-list">
            {comments.map((comment) => (
              <li key={comment.id}>
                <strong>{comment.user?.username ?? 'Anonymous'}</strong>
                <span>{comment.body}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments found.</p>
        )}
      </section>
    </div>
  )
}

export default PostDetails
