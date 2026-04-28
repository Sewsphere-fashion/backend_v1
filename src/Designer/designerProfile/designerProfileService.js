
import designer from "./designerProfile.model.js";
import User from "../../Users/user.model.js";
import AppError from "../../errorHandlers/appError.js";
import Labels from "../../utils/labels.js";

class DesignerService {

  static createDesigner = async (userId,data) => {
    const { speciality, city, state, bio } = data;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      Labels.serviceLog.warn(`User not found`, { userId });
      throw new AppError("User not found", 404);
    }

    //  Ensure user role is "designer"
    if (user.role !== "designer") {
      Labels.serviceLog.warn(`Unauthorized role attempt`, { userId, role: user.role });
      throw new AppError("Only users with role 'designer' can create a designer profile", 403);
    }

    //  Check if designer profile already exists
    const existingDesigner = await designer.findOne({ userId });
    if (existingDesigner) {
      Labels.serviceLog.warn(`Designer profile already exists`, { userId });
      throw new AppError("User already has a designer profile", 400);
    }

    //  Create designer profile
    const newDesigner = await designer.create({
      userId,
      speciality,
      city,
      country,
      bio,
    });

    Labels.serviceLog.info(`Designer profile created`, { userId });

    // Return clean response
    return {
      message: "Designer profile created successfully",
      designer: {
        id: newDesigner._id,
        userId: newDesigner.userId,
        speciality: newDesigner.speciality,
        city: newDesigner.city,
        country: newDesigner.country,
        bio: newDesigner.bio,
      },
    };
  };

  // Get designer profile by userId

  static getDesignerByUserId = async (userId) => {
    const designerProfile = await designer.findOne({ userId }).populate(
      "userId",
      "firstname lastname email role"
    );

    if (!designerProfile) {
      Labels.serviceLog.warn(`Designer profile not found`, { userId });
      throw new AppError("Designer profile not found", 404);
    }

    return designerProfile;
  };

  // update designer profile
  static updateDesigner = async (userId, data) => {
    const updatedDesigner = await designer.findOneAndUpdate(
      { userId },
      data,
      { new: true, runValidators: true }
    );

    if (!updatedDesigner) {
      Labels.serviceLog.warn(`Designer profile not found for update`, { userId });
      throw new AppError("Designer profile not found", 404);
    }

    Labels.serviceLog.info(`Designer profile updated`, { userId });
    return updatedDesigner;
  };


  //  Delete designer profile
  
  static deleteDesigner = async (userId) => {
    const deletedDesigner = await designer.findOneAndDelete({ userId });
    if (!deletedDesigner) {
      Labels.serviceLog.warn(`Designer profile not found for deletion`, { userId });
      throw new AppError("Designer profile not found", 404);
    }

    Labels.serviceLog.info(`Designer profile deleted`, { userId });
    return deletedDesigner;
  };

  
  //  List all designers (optional filter)
  
  static listDesigners = async (filter = {}) => {
    const designers = await designer.find(filter).populate(
      "userId",
      "firstname lastname email role"
    );
    return designers;
  };
}

export default DesignerService;