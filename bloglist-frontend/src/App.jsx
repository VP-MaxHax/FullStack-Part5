import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const refreshBlogs = async () => {
    await blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage(exception.response.data.error)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h3>{notificationMessage}</h3>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
          username
            <input
              data-testid="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
          password
            <input
              data-testid="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  } else {
    return (
      <div>
        <h3>{notificationMessage}</h3>
        <h2>blogs</h2>
        <p>{user.name} logged in <button onClick={() => {
          window.localStorage.removeItem('loggedNoteappUser')
          setUser(null)
        }}>logout</button></p>
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm
            user={user}
            setNotificationMessage={setNotificationMessage}
            blogFormRef={blogFormRef}
            blogService={blogService}
            setBlogs={setBlogs}
            blogs={blogs}
          />
        </Togglable>
        <div data-testid="all-blog-div">
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog} refreshBlogs={refreshBlogs} />
            )
          }
        </div>
      </div>
    )
  }
}


export default App