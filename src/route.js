import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: '/tasks',
    handler(req, res) {
      const { search } = req.query
      const data = database.select('tasks', search ? {
        title: search,
        description: search,
        created_at: search,
        updated_at: search,
        completed_at: search,
      } : null);
      res.end(JSON.stringify(data))
    }
  },
  {
    method: 'POST',
    path: '/tasks',
    handler(req, res) {
      let errors = []
      
      if (req.body) {
        if (!req.body.title) {
          errors.push({
            field: 'title',
            message: 'Title must be a valid string',
          })
        }
        
        if (!req.body.description) {
          errors.push({
            field: 'description',
            message: 'Description must be a valid string',
          })
        }
        
        if (errors.length === 0) {
          const { title, description } = req.body
          const data = database.insert('tasks', {
            title,
            description,
            completed_at: null,
            created_at: new Date(),
            updated_at: null,
          })

          return res.writeHead(201).end(JSON.stringify(data))
        }
        
        return res.writeHead(400).end(JSON.stringify(errors))
      }

      return res.writeHead(400).end(JSON.stringify([
        {
          field: 'title',
          message: 'Title must be a valid string',
        },
        {
          field: 'description',
          message: 'Description must be a valid string',
        }
      ]))
    }
  },
  {
    method: 'PUT',
    path: '/tasks/:id',
    handler(req, res) {
      const errors = []
      const { params: { id }, body } = req
      if (body !== null) {
        if (!req.body.title) {
          errors.push({
            field: 'title',
            message: 'Title must be a valid string',
          })
        }
        
        if (!req.body.description) {
          errors.push({
            field: 'description',
            message: 'Description must be a valid string',
          })
        }
        
        if (errors.length === 0) {
          const data = database.update('tasks', id, body);
          return data.status 
            ? res.writeHead(data.status).end(JSON.stringify({ message: data.message })) 
            : res.writeHead(200).end(JSON.stringify(data))
        }

      }

      return res.writeHead(400).end(JSON.stringify([
        {
          field: 'title',
          message: 'Title must be a valid string',
        },
        {
          field: 'description',
          message: 'Description must be a valid string',
        }
      ]))
    }
  },
  {
    method: 'PATCH',
    path: '/tasks/:id/complete',
    handler(req, res) {
      const { id } = req.params
      const data = database.update('tasks', id, {
        completed_at: new Date(),
      })

      return data.status 
      ? res.writeHead(data.status).end(JSON.stringify({ message: data.message })) 
      : res.writeHead(204).end(JSON.stringify(data))
    }
  },
  {
    method: 'DELETE',
    path: '/tasks/:id',
    handler(req, res) {
      const { id } = req.params
      const data = database.delete('tasks', id)
      return data && data.status 
        ? res.writeHead(data.status).end(JSON.stringify({ message: data.message })) 
        : res.writeHead(204).end()
    }
  },
]