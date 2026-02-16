const countBy = require('lodash/countBy')
const groupBy = require('lodash/groupBy')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  // here max is an object (blog with most likes)
  const reducer = (max, item) => {
    return max.likes > item.likes ? max : item
  }
  return blogs.reduce(reducer, {})
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = countBy(blogs, 'author')

  // collection to array
  const arr = Object.entries(blogsByAuthor).sort((a, b) => b[1] - a[1])
  return arr[0] ? { author: arr[0][0], blogs: arr[0][1] } : { author: 'NIL', blogs: 0 }

}

const mostLikes = (blogs) => {
  const groupByAuthor = groupBy(blogs, 'author') //collection of key value pairs. key=author. value=array of objects (blogs)

  for (const author in groupByAuthor){
    groupByAuthor[author] = groupByAuthor[author].reduce((sum, item) => sum + item.likes, 0)
  }

  const arr = Object.entries(groupByAuthor).sort((a, b) => b[1] - a[1])
  return arr[0] ? { author: arr[0][0], likes: arr[0][1] } : { author: 'NIL', likes: 0 }
}

module.exports = {
  dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}