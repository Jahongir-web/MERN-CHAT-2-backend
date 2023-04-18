const bcrypt = require("bcrypt");
const Users = require("../models/userModel");

const {uploadedFile, deleteFile, removeTmp} = require("../service/upload")


const userCtrl = {
  // Get a User
  getUser: async (req, res) => {
    const {id} = req.params
    try {
      const user = await Users.findById(id)
      if(user) {
        const {password, role, ...otherDetails} = user._doc
        return res.status(200).json(otherDetails)
      }
      res.status(404).json("No such User")
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }, 

  // Get all User
  getAllUsers: async (req, res) => {
    try {
      let users = await Users.find()
      users = users.map((user) => {
        const {password, role, ...otherDetails} = user._doc
        return otherDetails
      })

      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },

  // Update a User
  updateUser: async (req, res) => {
    const {id} = req.params
    try {
      const admin = await Users.findById(req.user.id)

      if(id === req.user.id || admin.role === 101) {
        if(req.body.password) {
          const heshPassword = await bcrypt.hash(req.body.password, 12)
          req.body.password = heshPassword
        }

        const user = await Users.findByIdAndUpdate(id, req.body, {new: true})

        const {password, role, ...otherDetails} = user._doc

        res.status(200).json(otherDetails)
      } else {
        res.status(403).json("Access Deined! You can update only your own Account.")
      }
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },

  // Delete a User
  deleteUser: async (req, res) => {
    const {id} = req.params
    const admin = await Users.findById(req.user.id)

    if(id === req.user.id || admin.role === 101) {
      try {
        const deletedUser = await Users.findByIdAndDelete(id)
        if(deletedUser) {
          return res.status(200).json("User deleted successfully!")
        }
        res.status(404).json("User not found!")
      } catch (error) {
        res.status(500).json({message: error.message})
      }
    } else {
      res.status(403).json("Access Deined! You can delete only your own Account.")
    }
  },

  
}


module.exports = userCtrl