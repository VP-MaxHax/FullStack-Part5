import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('correct data is sent when form is submitted', async () => {
    const mockHandler = vi.fn()
    const user = userEvent.setup()
    const mockUser = {
        'id': 'ab1234',
        'name': 'Test User',
        'username': 'testuser'
    }
    mockHandler.mockResolvedValue({ title: 'Test Title', author: 'Test Author', url: 'Test URL' });
    // mockHandler.mockReturnValue({ title: 'Test Title', author: 'Test Author', url: 'Test URL' , user: 'ab'})

    render(<BlogForm createProp={mockHandler} user={mockUser} blogFormRef={{ current: { toggleVisibility: vi.fn() }}} blogService={{ create: vi.fn() }} setBlogs={vi.fn()} blogs={[]} setNotificationMessage={vi.fn()} />)

    const titleInput = screen.getByTestId('title')
    const authorInput = screen.getByTestId('author')
    const urlInput = screen.getByTestId('url')
    await user.type(titleInput, 'Test Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'Test URL')
    const createButton = screen.getByText('create')
    screen.debug()
    await user.click(createButton)
    console.log(mockHandler.mock.calls)
    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe('Test Title')
    expect(mockHandler.mock.calls[0][0].author).toBe('Test Author')
    expect(mockHandler.mock.calls[0][0].url).toBe('Test URL')
})
