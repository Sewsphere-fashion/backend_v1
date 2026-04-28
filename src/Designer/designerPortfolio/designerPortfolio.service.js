import designer from "../designerProfile/designerProfile.model.js";
import designerPortfolio from "./designerPortfolio.model.js";
import AppError from "../../errorHandlers/appError.js"
import {v2 as cloudinary} from "cloudinary"

export const addPortfolioItem = async (userId, imageUrl, publicId, description) => {
  // Find the designer profile using the logged in user's ID
  const designerProfile = await designer.findOne({ userId })
  if (!designerProfile) throw new AppError('Designer profile not found', 404)

  // Check how many items they already have
  const count = await designerPortfolio.countDocuments({ designer: designerProfile._id })

  if (count >= 3) {
    await cloudinary.uploader.destroy(publicId)
    throw new AppError('Maximum of 3 portfolio items allowed. Delete one to add a new one.', 400)
  }

  const item = await designerPortfolio.create({
    designer:    designerProfile._id,   
    image:       { url: imageUrl, publicId },
    description
  })

  return item
}

export const deletePortfolioItem = async (userId, itemId) => {
  // Find designer profile first
  const designerProfile = await designer.findOne({ userId })
  if (!designerProfile) throw new AppError('Designer profile not found', 404)

  const item = await designerPortfolio.findById(itemId)
  if (!item) throw new AppError('Portfolio item not found', 404)

  // Make sure this item belongs to this designer
  if (item.designer.toString() !== designerProfile._id.toString()) {
    throw new AppError('You do not have permission to delete this item', 403)
  }

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(item.image.publicId)

  // Delete from DB
  await item.deleteOne()
}

export const getPortfolio = async (userId) => {
  // Find designer profile first
  const designerProfile = await designer.findOne({ userId })
  if (!designerProfile) throw new AppError('Designer profile not found', 404)

  const items = await designerPortfolio.find({ designer: designerProfile._id }).sort({ createdAt: -1 })
  return items
}