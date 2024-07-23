const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const blog = require('../../../FullStack-Part4/models/blog')

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByText('login')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('Login form is shown', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    describe('fails with wrong credentials', () => {
      test('fails with wrong username', async ({ page }) => {
          await loginWith(page, 'alaakso', 'salainen')
          await expect(page.getByText('invalid username or password')).toBeVisible()
      })

      test ('fails with wrong password', async ({ page }) => {
          await loginWith(page, 'mluukkai', 'wrong')
          await expect(page.getByText('invalid username or password')).toBeVisible()
      })
    })

    describe('when logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
      })

      test('a blog can be created', async ({ page }) => {
        await createBlog(page, 'a blog created by playwright', 'playwright', 'www.playwright.fi')
        await expect(page.getByText('a blog created by playwright playwright')).toBeVisible()
      })

      describe('and a blog exists', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'blog by playwright', 'playwright', 'www.playwright.fi')
        })

        test('a blog can be liked', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()
          await page.getByRole('button', { name: 'like' }).click()
          await expect(page.getByText('likes 1')).toBeVisible()
        })

        test('a blog can be deleted', async ({ page }) => {
          page.on('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept();
          });
          await page.getByRole('button', { name: 'view' }).click()
          await page.getByRole('button', { name: 'remove' }).click()
          await expect(page.getByText('blog by playwright playwright')).not.toBeVisible()
        })

        test('a blog cannot be deleted by another user', async ({ page, request }) => {
          await request.post('/api/users', {
            data: {
              name: 'Antti Laaksonen',
              username: 'alaakso',
              password: 'salainen'
            }
          })
          await page.goto('/')
          await page.getByRole('button', { name: 'logout' }).click()
          await loginWith(page, 'alaakso', 'salainen')
          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })
      })

      test('blogs are ordered by likes', async ({ page }) => {
        await createBlog(page, 'a blog with 0 likes', 'playwright', 'www.playwright.fi')
        await createBlog(page, 'a blog with 1 like', 'playwright', 'www.playwright.fi')
        await createBlog(page, 'a blog with 2 likes', 'playwright', 'www.playwright.fi')
        await page.getByText('a blog with 2 likes').getByRole('button').click()
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByText(`likes 1`).waitFor()
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByText(`likes 2`).waitFor()
        await page.getByText('a blog with 1 like').getByRole('button').click()
        const likeButton = await page.getByText('likes 0').getByRole('button')
        await likeButton.click()
        await page.getByText(`likes 1`).waitFor()
        const blogs = await page.$$('div[data-testid="blog"]')
        const blogText1 = await blogs[0].innerText()
        const blogText2 = await blogs[1].innerText()
        const blogText3 = await blogs[2].innerText()
        console.assert(blogText1.includes('a blog with 2 likes'), 'First blog does not have 2 likes')
        console.assert(blogText2.includes('a blog with 1 like'), 'Second blog does not have 1 like')
        console.assert(blogText3.includes('a blog with 0 likes'), 'Third blog does not have 0 likes')
      })
    })
  })
})