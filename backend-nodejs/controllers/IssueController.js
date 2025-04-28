const Issue = require('../models/Issue');

// Create a new issue
exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, priority, location } = req.body;

    // Validate required fields
    if (!title || !description || !category || !priority || !location) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          required: ['title', 'description', 'category', 'priority', 'location']
        }
      });
    }

    // Validate location structure
    if (!location.district || !location.sector) {
      return res.status(400).json({ 
        message: 'Location must include district and sector',
        details: {
          required: ['location.district', 'location.sector']
        }
      });
    }

    const newIssue = new Issue({
      title,
      description,
      category,
      priority,
      location: {
        district: location.district,
        sector: location.sector,
        latitude: location.latitude || 0,
        longitude: location.longitude || 0
      },
      reportedBy: req.body.reportedBy || 'Anonymous' // Default if not provided
    });

    const savedIssue = await newIssue.save();
    res.status(201).json(savedIssue);
  } catch (error) {
    console.error('Error creating issue:', error);
    // Return more detailed error message
    res.status(500).json({ 
      message: 'Server error while creating issue.',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get all issues
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('category')
      .populate('reportedBy')
      .populate('assignedTo');
      
    res.status(200).json(issues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ message: 'Server error while fetching issues.' });
  }
};

// Get single issue by ID
exports.getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id)
      .populate('category')
      .populate('reportedBy')
      .populate('assignedTo');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found.' });
    }

    res.status(200).json(issue);
  } catch (error) {
    console.error('Error fetching issue:', error);
    res.status(500).json({ message: 'Server error while fetching issue.' });
  }
};

// Update issue
exports.updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedIssue = await Issue.findByIdAndUpdate(id, updates, { new: true })
      .populate('category')
      .populate('reportedBy')
      .populate('assignedTo');

    if (!updatedIssue) {
      return res.status(404).json({ message: 'Issue not found.' });
    }

    res.status(200).json(updatedIssue);
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({ message: 'Server error while updating issue.' });
  }
};

// Delete issue
exports.deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIssue = await Issue.findByIdAndDelete(id);

    if (!deletedIssue) {
      return res.status(404).json({ message: 'Issue not found.' });
    }

    res.status(200).json({ message: 'Issue deleted successfully.' });
  } catch (error) {
    console.error('Error deleting issue:', error);
    res.status(500).json({ message: 'Server error while deleting issue.' });
  }
};
