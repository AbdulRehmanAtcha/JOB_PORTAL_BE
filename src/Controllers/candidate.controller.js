import { limit } from "../constant/index.js";
import { JobsModel } from "../Models/jobs.models.js";
import { TagsModel } from "../Models/tags.model.js";
import { ApiResponse } from "../Utils/ApiResponse.js";

export const GetJobsCandidate = async (req, res) => {
  try {
    const user = req?.user;
    if (!user) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Something went wrong"));
    }
    const { tags, city, type } = req?.query;

    const normalizedTags = Array.isArray(req?.query?.tags)
      ? req?.query?.tags?.map((item) => item?.toLowerCase())
      : tags
      ? [tags.toLowerCase()]
      : [];

    const normalizedTypes = Array.isArray(req?.query?.type)
      ? req?.query?.type
      : type
      ? [type]
      : [];

    const filter = {};
    if (city) {
      filter.city = city;
    }

    if (normalizedTypes?.length > 0) {
      filter.type = { $in: normalizedTypes };
    }

    console.log(normalizedTypes);

    if (normalizedTags?.length > 0) {
      const tagsDocs = await TagsModel.find({ name: { $in: normalizedTags } });
      const tagIds = tagsDocs.map((item) => item?._id);
      filter.tags = { $in: tagIds };
    }

    const currentPage = parseInt(req?.query?.page) || 1;
    const pageLimit = limit;
    const skip = (currentPage - 1) * pageLimit;

    const jobs = await JobsModel.find(filter)
      .populate("jobMaker", "companyName")
      .populate("tags", "name")
      .skip(skip)
      .limit(pageLimit);

    const totalJobs = await JobsModel.countDocuments(filter);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { jobs, pagination: { currentPage, total: totalJobs } },
          "Jobs Found"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, error?.message || "Internal Server Error")
      );
  }
};
