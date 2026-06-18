const Message = require('../models/Message');

// Récupérer les messages reçus par un formateur
exports.getFormateurMessages = async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.id })
      .populate('sender', 'fullName email')
      .populate('receiver', 'fullName email')
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Envoyer un message (étudiant → formateur)
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, courseId, content } = req.body;
    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      courseId: courseId || null,
      content
    });
    await message.populate('sender', 'fullName email');
    await message.populate('receiver', 'fullName email');
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Répondre à un message (formateur → étudiant)
exports.replyToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const parent = await Message.findById(messageId);
    if (!parent) return res.status(404).json({ message: 'Message non trouvé' });

    const reply = await Message.create({
      sender: req.user.id,
      receiver: parent.sender,
      courseId: parent.courseId,
      content,
      parentMessage: messageId
    });

    await reply.populate('sender', 'fullName email');
    await reply.populate('receiver', 'fullName email');
    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Marquer un message comme lu
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message non trouvé' });
    message.isRead = true;
    await message.save();
    res.json({ message: 'Message marqué comme lu' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un message
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};