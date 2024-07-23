import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author', () => {
    const blog = {
        user: "Test User",
        likes: 5,
        author: "Test Author",
        title: "Test Title",
        url: "Test URL"
      }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Test Title Test Author')
  expect(element).toBeDefined()
})

test('clicking "view" shows rest of the blogs info', async () => {
    const blog = {
        user: {
            id: "ab1234",
            name: "Test User",
            username: "testuser"
        },
        likes: 5,
        author: "Test Author",
        title: "Test Title",
        url: "Test URL"
      }

    const mockHandler = vi.fn()
    const user = userEvent.setup()

    render(<Blog blog={blog} />)
    const button = screen.getByText('view')
    await user.click(button)
    const urlElement = screen.getByText('Test URL')
    const likesElement = screen.getByText('likes 5')
    const userElement = screen.getByText('Test User')
})

test('clicking "like" twice calls event handler twice', async () => {
    const blog = {
        user: {
            id: "ab1234",
            name: "Test User",
            username: "testuser"
        },
        likes: 5,
        author: "Test Author",
        title: "Test Title",
        url: "Test URL"
      }

    const mockHandler = vi.fn()
    const user = userEvent.setup()

    render(<Blog blog={blog} addLikeProp={mockHandler} />)
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})
