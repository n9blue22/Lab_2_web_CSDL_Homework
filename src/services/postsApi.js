const API_URL = 'https://dummyjson.com'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return response.json()
}

export function getPosts(skip = 0, limit = 10) {
  return request(`/posts?limit=${limit}&skip=${skip}`)
}

export function searchPosts(query) {
  return request(`/posts/search?q=${encodeURIComponent(query)}`)
}

export function getPostComments(id) {
  return request(`/posts/${id}/comments`)
}

export function addPost(post) {
  return request('/posts/add', {
    method: 'POST',
    body: JSON.stringify({ ...post, userId: 1 }),
  })
}

export function deletePost(id) {
  return request(`/posts/${id}`, { method: 'DELETE' })
}
