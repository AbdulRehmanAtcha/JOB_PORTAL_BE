import CloudinaryService from "../Config/cloudinary.js";
import { JobsModel } from "../Models/jobs.models.js";
import { TagsModel } from "../Models/tags.model.js";
import { ApiResponse } from "../Utils/ApiResponse.js";

export const JobPostHandler = async (req, res) => {
  try {
    const { title, description, tags: rawTags, type, city } = req?.body;
    const companyLogoUrl = req.files?.companyLogo?.[0];

    let uploadedImage;

    if (companyLogoUrl) {
      uploadedImage = await CloudinaryService.uploadImage(
        companyLogoUrl.buffer,
        companyLogoUrl.originalname
      );
    }

    const HrId = req?.user?._id;

    // Converting all tags into lowercase
    const normalizedTags = rawTags?.map((name) => name?.toLowerCase());

    // Finding the tags which are already present in Tags Model
    const existingTags = await TagsModel.find({
      name: { $in: normalizedTags },
    });

    // Getting existing tags names and ids separately
    const existingTagsNames = existingTags?.map((item) => item?.name);
    const existingTagsIds = existingTags?.map((item) => item?._id);

    // Finding new tags
    const newTagsNames = normalizedTags?.filter(
      (name) => !existingTagsNames?.includes(name)
    );

    // Inserting new to DB
    const newTags = await TagsModel.insertMany(
      newTagsNames.map((item) => ({ item })),
      { ordered: false }
    );

    // Getting id of new inserted tags
    const newTagsIds = newTags?.map((item) => item?._id);

    // Making a final tags array (Array of ids)
    const allTags = [...newTagsIds, ...existingTagsIds];

    const job = {
      jobMaker: HrId,
      title,
      description,
      tags: allTags,
      type,
      city,
      companyLogo: uploadedImage?.secure_url,
    };

    const jobCreation = await JobsModel.create(job);
    const populatedJob = await JobsModel.findById(jobCreation._id).populate(
      "jobMaker",
      "-password -resume"
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, { job: populatedJob }, "Job created successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, error?.message || "Internal Server Error")
      );
  }
};
