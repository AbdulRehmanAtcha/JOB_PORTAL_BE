// src/utils/seedTags.js

import { allowedSkills } from "./constant/index.js";
import { TagsModel } from "./Models/tags.model.js";

export const seedTags = async () => {
  try {
    for (const skill of allowedSkills) {
      await TagsModel.updateOne(
        { name: skill },
        { $setOnInsert: { name: skill } },
        { upsert: true }
      );
    }
    console.log("✅ Default skills have been seeded.");
  } catch (error) {
    console.error("❌ Error while seeding tags:", error.message);
  }
};
