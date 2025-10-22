// Script to clean up orphaned results (results that reference deleted exams)
import mongoose from "mongoose";
import Result from "../models/Result.js";
import Exam from "../models/Exam.js";

const cleanupOrphanedResults = async () => {
  try {
    console.log("🔍 Starting cleanup of orphaned results...");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/llm2");
    console.log("✅ Connected to MongoDB");
    
    // Find all results
    const allResults = await Result.find({}).populate("examId");
    console.log(`📊 Found ${allResults.length} total results`);
    
    // Find orphaned results (where examId is null after populate)
    const orphanedResults = allResults.filter(result => result.examId === null);
    console.log(`🗑️ Found ${orphanedResults.length} orphaned results`);
    
    if (orphanedResults.length > 0) {
      console.log("📝 Orphaned result IDs:", orphanedResults.map(r => r._id));
      
      // Delete orphaned results
      const deleteResult = await Result.deleteMany({
        _id: { $in: orphanedResults.map(r => r._id) }
      });
      
      console.log(`✅ Deleted ${deleteResult.deletedCount} orphaned results`);
    } else {
      console.log("✨ No orphaned results found - database is clean!");
    }
    
    // Also clean up any results that reference non-existent exams
    const allExamIds = await Exam.find({}, "_id");
    const validExamIds = allExamIds.map(exam => exam._id.toString());
    
    const invalidResults = await Result.find({
      examId: { $nin: validExamIds }
    });
    
    if (invalidResults.length > 0) {
      console.log(`🔧 Found ${invalidResults.length} results with invalid exam references`);
      const deleteInvalidResult = await Result.deleteMany({
        examId: { $nin: validExamIds }
      });
      console.log(`✅ Deleted ${deleteInvalidResult.deletedCount} invalid results`);
    }
    
    console.log("🎉 Cleanup completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Run the cleanup
cleanupOrphanedResults();
