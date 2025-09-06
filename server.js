import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url'

const mimeTypeMap = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain'
}

/*
Gets the server.js file path, then the directory that server.js lives in (root dir), 
then adds /public to the root dir path.
*/
const getPublicDirPath = () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const publicDir = path.join(__dirname, 'public')

  return publicDir;
}

const publicDir = getPublicDirPath()
const PORT = 3000

const server = http.createServer((req, res) => {
  // prevent directory-traversal
  const safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '')
  let fileLoc = path.join(publicDir, safeSuffix)
  // if URL ends in slash, serve index.html
  if (fileLoc.endsWith(path.sep)) fileLoc += 'index.html'

  // if file has no pathname, assume it is a .js file
  if (!path.extname(fileLoc)) fileLoc += ".js";

  fs.stat(fileLoc, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('404 Not Found')
      return
    }
    const ext = path.extname(fileLoc)
    const type = mimeTypeMap[ext] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': type })
    fs.createReadStream(fileLoc).pipe(res)
  })
})

server.listen(PORT, () => {
  console.log(`► Serving ${publicDir} at http://localhost:${PORT}`)
})
