const Ticket = require('../models/Ticket');

// GET /api/tickets
const getAllTickets = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, category } = req.query;

    const filter = {};

    // Students only see their own tickets
    if (req.user.role === 'student') {
      filter.raisedBy = req.user._id;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const tickets = await Ticket.find(filter)
      .populate('raisedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Ticket.countDocuments(filter);

    res.json({
      tickets,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/tickets
const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      raisedBy: req.user._id,
    });

    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/tickets/:id
const updateTicket = async (req, res) => {
  try {
    const { status, assignedTo, resolution } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (resolution) updateData.resolution = resolution;

    // Set resolvedAt when status is resolved
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('raisedBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ message: 'Ticket updated successfully', ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/tickets/:id
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllTickets, createTicket, updateTicket, deleteTicket };