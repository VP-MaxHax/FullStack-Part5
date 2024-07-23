import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ user, setNotificationMessage, blogFormRef, blogService, setBlogs, blogs, createProp }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createNewBlog = async (event) => {
    event.preventDefault()
    const create = createProp || blogService.create
    try{
      blogFormRef.current.toggleVisibility()
      const newBlog = {
        title,
        author,
        url
      }
      const response = await create(newBlog)
      console.log(user)
      console.log(response)
      const blogWithUser = { ...response, user: { id: response.user, name: user.name, username: user.username } }
      console.log(user)
      console.log(response)
      console.log(blogWithUser)
      setBlogs(blogs.concat(blogWithUser))
      setNotificationMessage(`a new blog ${response.title} by ${response.author} added`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      console.log(exception)
      setNotificationMessage(exception.response.data.error)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return null
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createNewBlog}>
        <div>
            title:
          <input
            type="text"
            value={title}
            data-testid='title'
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
            author:
          <input
            type="text"
            value={author}
            data-testid='author'
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
            url:
          <input
            type="text"
            value={url}
            data-testid='url'
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit" data-testid="create" >create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  user: PropTypes.object.isRequired,
  setNotificationMessage: PropTypes.func.isRequired,
  blogFormRef: PropTypes.object.isRequired,
  blogService: PropTypes.object.isRequired,
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired
}

export default BlogForm