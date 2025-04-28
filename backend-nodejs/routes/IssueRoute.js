const express = require('express');
const router = express.Router();
const issueController = require('../controllers/IssueController');

// Create a new issue
router.post('/', issueController.createIssue);

// Get all issues
router.get('/getissue', issueController.getAllIssues);

// Get a single issue by ID
router.get('/:id', issueController.getIssueById);

// Update an issue by ID
router.put('/:id', issueController.updateIssue);

// Delete an issue by ID
router.delete('/:id', issueController.deleteIssue);

module.exports = router;
