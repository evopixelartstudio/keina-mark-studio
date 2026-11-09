const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Normalização de rotas
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  } else if (pathname === '/admin' || pathname === '/admin/') {
    pathname = '/admin.html';
  }

  // Prevenção de Path Traversal
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(ROOT_DIR, safePath);

  // Suporte a fallback de arquivos estáticos em public/ (/Hero.png, /products/...)
  if (!fs.existsSync(filePath)) {
    const alternativePath = path.join(ROOT_DIR, 'public', safePath);
    if (fs.existsSync(alternativePath)) {
      filePath = alternativePath;
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Se for diretório com index.html
      if (stats && stats.isDirectory()) {
        const indexFile = path.join(filePath, 'index.html');
        if (fs.existsSync(indexFile)) {
          return serveFile(indexFile, res);
        }
      }
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>404</title></head><body style="font-family:sans-serif;padding:40px;text-align:center;"><h1>404 — Página Não Encontrada</h1><p><a href="/">&larr; Voltar para a Loja</a></p></body></html>`);
      return;
    }

    serveFile(filePath, res);
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*'
  });

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  stream.on('error', (err) => {
    console.error('Erro ao servir arquivo:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erro interno do servidor.');
    }
  });
}

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  KEINA MARK STUDIO — SERVIDOR EM EXECUÇÃO`);
  console.log(`  Loja Virtual:         http://localhost:${PORT}`);
  console.log(`  Painel Administrativo: http://localhost:${PORT}/admin`);
  console.log(`======================================================\n`);
});
