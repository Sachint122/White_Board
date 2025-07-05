const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
router.post('/join', async (req, res) => {
  const { roomId } = req.body;
  try {
    let room = await Room.findOne({ roomId });
    if (!room) {
      room = new Room({ roomId });
      await room.save();
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: 'Server error while joining room.' });
  }
});

router.get('/:roomId', async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
