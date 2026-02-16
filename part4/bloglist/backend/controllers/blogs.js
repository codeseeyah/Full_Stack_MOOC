const userExtractor = require('../utils/middleware').userExtractor
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const blog = new Blog(request.body)
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'No user found to associate with the blog' })
  }

  blog.user = user._id

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id
  const user = request.user
  const blogToDelete = await Blog.findById(id)

  if (!user || !blogToDelete) {
    return response.status(400).json({ error: 'User or blog not found' })
  }

  if (blogToDelete.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'Only the creator of the blog can delete it' })
  }

  await Blog.deleteOne({ _id: id })
  response.status(204).end()
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const id = request.params.id
  const user = request.user
  const blogToUpdate = await Blog.findById(id)

  if (!user || !blogToUpdate) {
    return response.status(400).json({ error: 'User or blog not found' })
  }

  if (blogToUpdate.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'Only the creator of the blog can update it' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, request.body, { returnDocument: 'after' })
  response.json(updatedBlog)
})

module.exports = blogsRouter