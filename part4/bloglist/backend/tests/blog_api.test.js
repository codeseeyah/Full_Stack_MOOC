const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'author 1',
    url: 'http://example.com/first-blog',
    likes: 5
  },
  {
    title: 'Second Blog',
    author: 'Motu Khan',
    url: 'http://example.com/second-blog',
    likes: 13
  }
]

describe('Fetching blogs', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

  test('blogs returned correctly as json', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.status, 200)
    assert.match(response.headers['content-type'], /application\/json/)
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach((blog) => {
      assert.ok(blog.id !== undefined)
    })
  })

})

describe('Adding new blog / bad requests for adding new blog', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password123', 10)
    const user = new User({ username: 'testuser', name: 'Test User', passwordHash })
    await user.save()
    const loginResponse = await api.post('/api/login').send({ username: 'testuser', password: 'password123' })
    token = loginResponse.body.token
  })

  test('blog is correctly added', async () => {
    const newBlog = {
      title: 'New Blog test',
      author: 'ali',
      url: 'http://example.com/new-blog',
      likes: 18
    }
    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog)
    assert.strictEqual(response.status, 201)
    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, 1)
    updatedBlogs = blogsAtEnd.map((blog) => blog.toJSON())
    assert.ok(updatedBlogs.some((blog) => blog.title === newBlog.title && blog.author === newBlog.author))
  })

  test('blog is correctly added with missing likes', async () => {
    const newBlog = {
      title: 'New Blog test eith 0 likes',
      author: 'ali tariq',
      url: 'http://example.com/new-blogsss'
    }
    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog)
    assert.strictEqual(response.status, 201)
    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, 1)
    const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title && blog.author === newBlog.author)
    assert.strictEqual(addedBlog.likes, 0)
  })


  test('bad request with missing title or url', async () => {
    const badBlog1 = {
      author: 'unknown'
    }
    const badBlog2 = {
      title: 'No URL',
      author: 'Author'
    }
    const badBlog3 = {
      url: 'http://example.com/no-title',
      author: 'Author'
    }

    const response1 = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(badBlog1)
    assert.strictEqual(response1.status, 400)

    const response2 = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(badBlog2)
    assert.strictEqual(response2.status, 400)

    const response3 = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(badBlog3)
    assert.strictEqual(response3.status, 400)
  })

  test('Adding blog fails when token not provided', async () => {
    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'Unauthorized Author',
      url: 'http://example.com/unauthorized-blog',
      likes: 0
    }
    const response = await api.post('/api/blogs').send(newBlog)
    assert.strictEqual(response.status, 401)
  })

})

describe('Deleting a blog', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password123', 10)
    const user = new User({ username: 'testuser', name: 'Test User', passwordHash })
    await user.save()
    const loginResponse = await api.post('/api/login').send({ username: 'testuser', password: 'password123' })
    token = loginResponse.body.token

    const blogsWithUser = initialBlogs.map((blog) => ({ ...blog, user: user._id }))
    await Blog.insertMany(blogsWithUser)
  })

  test('blog can be deleted, when blog exists', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0].toJSON()

    const response = await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`)
    assert.strictEqual(response.status, 204)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    const deletedBlog = blogsAtEnd.find((blog) => blog.id === blogToDelete.id)
    assert.strictEqual(deletedBlog, undefined)
  })

  test('deleting non-existing blog returns 400', async () => {
    const nonExistingId = new mongoose.Types.ObjectId()
    const response = await api.delete(`/api/blogs/${nonExistingId}`).set('Authorization', `Bearer ${token}`)
    assert.strictEqual(response.status, 400)
  })

})

describe('Updating a blog', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password123', 10)
    const user = new User({ username: 'testuser', name: 'Test User', passwordHash })
    await user.save()
    const loginResponse = await api.post('/api/login').send({ username: 'testuser', password: 'password123' })
    token = loginResponse.body.token

    const blogsWithUser = initialBlogs.map((blog) => ({ ...blog, user: user._id }))
    await Blog.insertMany(blogsWithUser)
  })

  test('blog likes can be updated', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]
    const updatedBlogData = {
      ...blogToUpdate.toJSON(),
      likes: blogToUpdate.likes + 1
    }

    const response = await api.put(`/api/blogs/${blogToUpdate.id}`).set('Authorization', `Bearer ${token}`).send(updatedBlogData)
    assert.strictEqual(response.status, 200)
    const updatedBlog = await Blog.findById(blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
  })

})

describe('Adding a new user', () => {

  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('user is correctly added', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'password123'
    }
    const response = await api.post('/api/users').send(newUser)
    assert.strictEqual(response.status, 201)
    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 1)
    const addedUser = usersAtEnd[0].toJSON()
    assert.strictEqual(addedUser.username, newUser.username)
    assert.strictEqual(addedUser.name, newUser.name)
    assert.strictEqual(addedUser.passwordHash, undefined) // since we dont return password hashes
  })

  test('bad request with missing password or short password', async () => {
    // Missing password
    const badUser1 = {
      username: 'user1',
      name: 'User One'
    }
    // Short password
    const badUser2 = {
      username: 'user2',
      name: 'User Two',
      password: 'pw'
    }
    //missing username
    const badUser3 = {
      name: 'User Three',
      password: 'password123'
    }
    // short username
    const badUser4 = {
      username: 'us',
      name: 'User Four',
      password: 'password123'
    }

    const response1 = await api.post('/api/users').send(badUser1)
    assert.strictEqual(response1.status, 400)

    const response2 = await api.post('/api/users').send(badUser2)
    assert.strictEqual(response2.status, 400)

    const response3 = await api.post('/api/users').send(badUser3)
    assert.strictEqual(response3.status, 400)

    const response4 = await api.post('/api/users').send(badUser4)
    assert.strictEqual(response4.status, 400)
  })

  test('test that duplicate usernames are not allowed', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'password123'
    }

    const response1 = await api.post('/api/users').send(newUser)
    assert.strictEqual(response1.status, 201)

    const response2 = await api.post('/api/users').send(newUser)
    assert.strictEqual(response2.status, 400)
  })
})

after(async () => {
  await mongoose.connection.close()
})