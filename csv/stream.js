import { createReadStream } from 'node:fs'
import { parse } from 'csv-parse'

const host = 'localhost'
const port = 3333
const endpoint = 'tasks'
const method = 'POST'
const url = 
  `${port === 443 ? 'https://' : 'http://'}`+
  `${host}${port === 80 || port === 443 ? '' : ':'+port}`+
  `/${endpoint}`

// Reading the csv file
const filePath = new URL('./tasks.csv', import.meta.url)
const fileRead = createReadStream(filePath)

// Parsing the csv file
const fileParse = parse({
  delimiter: ',',
  from_line: 2,
  skip_empty_lines: true,
})

async function exec() {
  // Reading each line
  const lines = fileRead.pipe(fileParse)
  for await (const line of lines) {
    const [title, description] = line;
    await post({ title, description })
  }
}

async function post(data) {
  await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

exec()