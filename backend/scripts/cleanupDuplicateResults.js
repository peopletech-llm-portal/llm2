// Script to clean up duplicate exam results
import mongoose from "mongoose";
import Result from "../models/Result.js";
import Exam from "../models/Exam.js";

const cleanupDuplicateResults = async () => {
  try {
    console.log("🔍 Starting cleanup of duplicate exam results...");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/llm2");
    console.log("✅ Connected to MongoDB");
    
    // Find all results grouped by examId and studentId
    const results = await Result.find({}).populate("examId", "title examType");
    console.log(`📊 Found ${results.length} total results`);
    
    // Group results by examId and studentId to find duplicates
    const groupedResults = {};
    results.forEach(result => {
      const key = `${result.examId?._id || result.examId}-${result.studentId}`;
      if (!groupedResults[key]) {
        groupedResults[key] = [];
      }
      groupedResults[key].push(result);
    });
    
    // Find duplicates (more than one result for same exam-student combination)
    const duplicates = [];
    Object.entries(groupedResults).forEach(([key, resultList]) => {
      if (resultList.length > 1) {
        duplicates.push({
          key,
          examId: resultList[0].examId?._id || resultList[0].examId,
          studentId: resultList[0].studentId,
          examTitle: resultList[0].examId?.title || 'Unknown Exam',
          count: resultList.length,
          results: resultList
        });
      }
    });
    
    console.log(`🔍 Found ${duplicates.length} duplicate exam-student combinations`);
    
    if (duplicates.length > 0) {
      let totalDeleted = 0;
      
      for (const duplicate of duplicates) {
        console.log(`\n📝 Processing: ${duplicate.examTitle} (${duplicate.examId})`);
        console.log(`   Student: ${duplicate.studentId}`);
        console.log(`   Duplicate count: ${duplicate.count}`);
        
        // Sort by creation date (keep the latest, delete older ones)
        const sortedResults = duplicate.results.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Keep the first (latest) result, delete the rest
        const toDelete = sortedResults.slice(1);
        const toKeep = sortedResults[0];
        
        console.log(`   Keeping: ${toKeep._id} (created: ${toKeep.createdAt})`);
        console.log(`   Deleting: ${toDelete.map(r => r._id).join(', ')}`);
        
        // Delete the older duplicates
        const deleteResult = await Result.deleteMany({
          _id: { $in: toDelete.map(r => r._id) }
        });
        
        totalDeleted += deleteResult.deletedCount;
        console.log(`   ✅ Deleted ${deleteResult.deletedCount} duplicates`);
      }
      
      console.log(`\n🎉 Cleanup completed! Total duplicates deleted: ${totalDeleted}`);
    } else {
      console.log("✨ No duplicate results found - database is clean!");
    }
    
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Run the cleanup
cleanupDuplicateResults();

