const Issue = require('../models/Issue');
// const { predict } = require('../ml/predict');

exports.createIssue = async (req, res) => {
  // try {
  //   const { title, description, category } = req.body;

  //   const { priority, assignedTo } = await predict({ title, description, category });

  //   const newIssue = new Issue({
  //     title,
  //     description,
  //     category,
  //     priority,
  //     assignedTo,
  //     reportedBy: req.user.id
  //   });

  //   await newIssue.save();
  //   res.status(201).json(newIssue);

  // } catch (error) {
  //   console.error('Error creating issue:', error);
  //   res.status(500).json({ message: 'Server error' });
  // }
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
    res.status(500).json({ message: 'Server error while fetching issues.',issues });
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
