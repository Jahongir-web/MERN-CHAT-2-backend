const Message = require("../models/messageModel")

const messageCtrl = {
  // create new message
  addMessage: async (req, res) => {
    try {
      const {chatId, senderId, text} = req.body

      const message = new Message({chatId, senderId, text})
      await message.save()

      res.status(201).json(message)

    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },

  // get messages
  getMessages: async (req, res) => {
    try {
      const {chatId} = req.params
      const messages = await Message.find({chatId})
      res.status(200).json(messages)
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },

  // delete a message
  deleteMessage: async (req, res) => {
    try {
      const {messageId} = req.params
      const messages = await Message.findByIdAndDelete(messageId)
      if(messages) {
        return res.status(200).json("Message deleted successfully!")
      }
      res.status(404).json("Message not found!")
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },
}


module.exports = messageCtrl