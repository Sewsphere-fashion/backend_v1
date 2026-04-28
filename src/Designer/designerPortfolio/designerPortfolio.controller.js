import { addPortfolioItem, deletePortfolioItem, getPortfolio } from "../designerPortfolio/designerPortfolio.service.js"
import { uploadImage } from "../../config/cloudinary.config.js"
import AppError from "../../errorHandlers/appError.js"

export const uploadPortfolioItem = (req, res, next) => {
  uploadImage.single('photo')(req, res, async function (err) {
    if (err) return next(new AppError(err.message, 400))

    try {
      const imageUrl    = req.file.path
      const publicId    = req.file.filename
      const { description } = req.body

      if (!description) return next(new AppError('Description is required', 400))

      const item = await addPortfolioItem(req.user._id, imageUrl, publicId, description)

      res.status(201).json({
        message: 'Portfolio item added',
        item
      })

    } catch (error) {
      next(new AppError(error.message, error.statusCode || 500))
    }
  })
}

export const removePortfolioItem = async (req, res, next) => {
  try {
    await deletePortfolioItem(req.user._id, req.params.itemId)
    res.status(200).json({ message: 'Portfolio item deleted' })
  } catch (error) {
    next(new AppError(error.message, error.statusCode || 500))
  }
}

export const getDesignerPortfolio = async (req, res, next) => {
  try {
    const items = await getPortfolio(req.user._id)
    res.status(200).json({
      count: items.length,
      items
    })
  } catch (error) {
    next(new AppError(error.message, 500))
  }
}