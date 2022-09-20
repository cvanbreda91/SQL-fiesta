const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// Get all roles and their departnemts - working
router.get('/roles', (req, res) => {
  const sql = `SELECT roles.*, departments.name
                AS department_name 
                FROM roles 
                LEFT JOIN departments 
                ON roles.department_id = departments.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Get single role with department - working
router.get('/role/:id', (req, res) => {
  const sql = `SELECT roles.*, departments.name 
               AS department_name 
               FROM roles
               LEFT JOIN departments
               ON roles.department_id = departments.id 
               WHERE roles.id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Create a role - working
router.post('/role', ({ body }, res) => {
  const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
  const params = [
    body.title,
    body.salary,
    body.department_id
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// Update a role's department - working
router.put('/role/:id', (req, res) => {
  const sql = `UPDATE  roles SET department_id= ? 
               WHERE id = ?`;
  const params = [req.body.department_id, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Role not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Delete a role - working
router.delete('/role/:id', (req, res) => {
  const sql = `DELETE FROM roles WHERE id = ?`;

  db.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Role not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

module.exports = router;
