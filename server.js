import { createServer } from 'node:http'
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const scrypt = promisify(scryptCallback)
const dataDirectory = path.dirname(fileURLToPath(import.meta.url))
const authFile = path.join(dataDirectory, 'auth.json')
const studentsFile = path.join(dataDirectory, 'students.json')
const port = 4000

const readUsers = async () => {
  const data = JSON.parse(await readFile(authFile, 'utf8'))
  return Array.isArray(data.users) ? data.users : []
}

const saveUsers = (users) => writeFile(authFile, `${JSON.stringify({ users }, null, 2)}\n`, 'utf8')

const readStudents = async () => {
  const data = JSON.parse(await readFile(studentsFile, 'utf8'))
  return Array.isArray(data.students) ? data.students : []
}

const saveStudents = (students) => writeFile(studentsFile, `${JSON.stringify({ students }, null, 2)}\n`, 'utf8')

const hashPassword = async (password, salt = randomBytes(16).toString('hex')) => {
  const derivedKey = await scrypt(password, salt, 64)
  return `${salt}:${derivedKey.toString('hex')}`
}

const passwordMatches = async (password, storedPassword) => {
  const [salt, storedKey] = storedPassword.split(':')
  if (!salt || !storedKey) return false
  const derivedKey = await scrypt(password, salt, 64)
  const storedBuffer = Buffer.from(storedKey, 'hex')
  return storedBuffer.length === derivedKey.length && timingSafeEqual(storedBuffer, derivedKey)
}

const sendJson = (response, status, payload) => {
  response.writeHead(status, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(payload))
}

const readBody = (request) => new Promise((resolve, reject) => {
  let body = ''
  request.on('data', (chunk) => { body += chunk })
  request.on('end', () => {
    try { resolve(JSON.parse(body || '{}')) } catch { reject(new Error('Invalid request body.')) }
  })
  request.on('error', reject)
})

const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email })

const server = createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/api/students') {
    try {
      sendJson(response, 200, { students: await readStudents() })
    } catch (error) {
      console.error(error)
      sendJson(response, 500, { message: 'Student records could not be loaded.' })
    }
    return
  }

  if (request.method === 'POST' && request.url === '/api/students') {
    try {
      const body = await readBody(request)
      const name = String(body.name || '').trim()
      const date = String(body.date || '').trim()
      const phone = String(body.phone || '').trim()
      const remarks = String(body.remarks || '').trim()
      const courses = String(body.courses || '').split(',').map((course) => course.trim()).filter(Boolean)
      const qualifications = String(body.qualifications || '').split(',').map((qualification) => qualification.trim()).filter(Boolean)

      if (!name || !date || !phone || courses.length === 0 || qualifications.length === 0) {
        sendJson(response, 400, { message: 'Name, date, phone, courses, and qualifications are required.' })
        return
      }

      const students = await readStudents()
      const student = { id: Date.now(), date, name, courses, qualifications, phone, remarks }
      await saveStudents([...students, student])
      sendJson(response, 201, { student })
    } catch (error) {
      console.error(error)
      sendJson(response, 500, { message: 'Student record could not be saved.' })
    }
    return
  }

  if (request.method !== 'POST' || !['/api/register', '/api/login'].includes(request.url)) {
    sendJson(response, 404, { message: 'Not found.' })
    return
  }

  try {
    const body = await readBody(request)
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')

    if (!email || !password) {
      sendJson(response, 400, { message: 'Email and password are required.' })
      return
    }

    const users = await readUsers()
    const existingUser = users.find((user) => user.email === email)

    if (request.url === '/api/register') {
      const name = String(body.name || '').trim()
      if (!name) {
        sendJson(response, 400, { message: 'Full name is required.' })
        return
      }
      if (password.length < 8) {
        sendJson(response, 400, { message: 'Password must be at least 8 characters.' })
        return
      }
      if (existingUser) {
        sendJson(response, 409, { message: 'An account with that email already exists.' })
        return
      }

      const user = {
        id: randomBytes(8).toString('hex'),
        name,
        email,
        password: await hashPassword(password),
      }
      await saveUsers([...users, user])
      sendJson(response, 201, { user: publicUser(user) })
      return
    }

    if (!existingUser || !(await passwordMatches(password, existingUser.password))) {
      sendJson(response, 401, { message: 'Email or password is incorrect.' })
      return
    }

    sendJson(response, 200, { user: publicUser(existingUser) })
  } catch (error) {
    console.error(error)
    sendJson(response, 500, { message: 'The authentication server is unavailable.' })
  }
})

server.listen(port, () => {
  console.log(`Auth API listening on http://localhost:${port}`)
})
