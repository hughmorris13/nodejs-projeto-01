import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'

const databaseFile = new URL('../db.json', import.meta.url);

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databaseFile, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }
  
  select(table, search = null) {
    let data = this.#database[table] ?? [];

    if (search !== null) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return String(row[key]).toLowerCase().includes(value.toLowerCase())
        })
      });
    }
    
    return data;
  }
  
  insert(table, data) {
    const id = randomUUID()
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push({
        id,
        ...data,
      });
    }

    if (!Array.isArray(this.#database[table])) {
      this.#database[table] = [{ id, ...data }];
    }

    this.#persist();
    return {
      id,
      ...data,
    };
  }
  
  update(table, id, data) {
    const index = this.#database[table].findIndex(row => row.id === id);
    if (index > -1) {
      const storedData = this.#database[table][index]
      const newData = {
        ...storedData,
        ...data,
        updated_at: new Date(),
      }
      this.#database[table][index] = newData
      this.#persist()
      return newData;
    }

    return {
      status: 404,
      message: 'item not found'
    }
  }
  
  delete(table, id) {
    const index = this.#database[table].findIndex(row => row.id === id);
    if (index > -1) {
      this.#database[table].splice(index, 1);
      this.#persist()
    }
    else {
      return {
        status: 404,
        message: 'item not found'
      }
    }
  }
  
  #persist() {
    fs.writeFile(databaseFile, JSON.stringify(this.#database));
  }
}