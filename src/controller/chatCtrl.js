const Chat = require("../models/chatModel")

const chatCtrl = {
  
  // Chat List
  userChats: async (req, res) => {
    try {
      const {id} = req.user
      const chats = await Chat.find({members: {$in: [id]}})
      res.status(200).json(chats)      
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },

  // find Chat or Create a Chat
  findChat: async (req, res) => {
    try {
      const {firstId, secondId} = req.params
      const chat = await Chat.find({members: {$all: [firstId, secondId]}})

      if(chat.length) {
        return res.status(200).json(chat)
      }

      const newChat = new Chat({members: [firstId, secondId]})
      await newChat.save()
      res.status(201).json(newChat)
      
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },

  // Delete a Chat
}

module.exports = chatCtrl