const express = require('express');
const cors = require('cors');
const jsonServer = require('json-server');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const router = jsonServer.router(
  path.join(__dirname, 'db.json')
);

const middlewares = jsonServer.defaults();

app.use(cors());
app.use(express.json());
app.use(middlewares);
app.use(router);

app.listen(port, '0.0.0.0', () => {
  console.log(`Kanban API is running on port ${port}`);
});