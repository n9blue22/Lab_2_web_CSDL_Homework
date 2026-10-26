import { useState } from 'react'

function PostForm({ onAdd, isSubmitting }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim() || !body.trim()) return

    const added = await onAdd({ title: title.trim(), body: body.trim() })
    if (added) {
      setTitle('')
      setBody('')
    }
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>New post</h2>
      <label>
        Title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Post title"
          required
        />
      </label>
      <label>
        Body
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write something..."
          rows="4"
          required
        />
      </label>
      <button type="submit" disabled={isSubmitting || !title.trim() || !body.trim()}>
        {isSubmitting ? 'Adding...' : 'Add post'}
      </button>
    </form>
  )
}

export default PostForm
