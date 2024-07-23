import React, { useState } from 'react'
import blogsService from '../services/blogs'

const Blog = ({ blog, addLikeProp, refreshBlogs }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [show, setShow] = useState(false)
  const [blogData, setBlogData] = useState(blog)
  const [blogUser, setBlogUser] = useState(blog.user.name)
  const [isVisible, setIsVisible] = useState(true)

  const toggleShow = () => {
    setShow(!show)
  }

  const internalAddLike = async () => {
    blog.likes += 1
    const newBlog = {
      user: blog.user.id,
      likes: blog.likes,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    await blogsService.update(blog.id, newBlog)
    await refreshBlogs()
    setBlogData(newBlog)
  }

  const addLike = addLikeProp || internalAddLike

  const drawRemoveButton = () => {
    const userString = window.localStorage.getItem('loggedNoteappUser')
    if (userString) {
      const user = JSON.parse(userString)
      if (blog.user.username === user.username) {
        return (
          <div>
            <button onClick={removeBlog}>remove</button>
          </div>
        )
      }
    }
  }

  const removeBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogsService.remove(blog.id)
      setIsVisible(false)
    }
  }

  if (!isVisible) {
    return null
  }

  if (show) {
    return (
      <div style={blogStyle} className='blog' data-testid="blog">
        {blogData.title} {blogData.author} <button onClick={toggleShow} data-testid="hide">hide</button>
        <div>
          {blogData.url}
        </div>
        <div>
          likes {blogData.likes} <button onClick={addLike}>like</button>
        </div>
        <div>
          {blogUser}
        </div>
        {drawRemoveButton()}
      </div>
    )
  } else {
    return (
      <div style={blogStyle} data-testid="blog">
        {blogData.title} {blogData.author} <button onClick={toggleShow}>view</button>
      </div>
    )
  }
}

export default Blog