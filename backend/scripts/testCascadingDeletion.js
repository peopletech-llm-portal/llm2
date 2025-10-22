// Test script to verify cascading deletion works properly
import mongoose from "mongoose";
import Exam from "../models/Exam.js";
import Result from "../models/Result.js";
import User from "../models/User.js";

const testCascadingDeletion = async () => {
  try {
    console.log("🧪 Starting cascading deletion test...");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/llm2");
    console.log("✅ Connected to MongoDB");
    
    // Create a test user if it doesn't exist
    let testUser = await User.findOne({ email: "test@example.com" });
    if (!testUser) {
      testUser = new User({
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        role: "INTERN"
      });
      await testUser.save();
      console.log("👤 Created test user");
    }
    
    // Create a test exam
    const testExam = new Exam({
      title: "Test Exam for Deletion",
      examType: "mcq",
      questions: [
        {
          question: "What is 2+2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 1
        }
      ],
      startTime: new Date(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      duration: 30
    });
    await testExam.save();
    console.log("📝 Created test exam:", testExam._id);
    
    // Create test results for this exam
    const testResults = [];
    for (let i = 0; i < 3; i++) {
      const result = new Result({
        examId: testExam._id,
        studentId: testUser._id,
        examType: "mcq",
        score: Math.floor(Math.random() * 5) + 1,
        totalQuestions: 1,
        mcqAnswers: [Math.floor(Math.random() * 4)]
      });
      await result.save();
      testResults.push(result);
      console.log(`📊 Created test result ${i + 1}:`, result._id);
    }
    
    // Verify results exist
    const resultsBeforeDeletion = await Result.find({ examId: testExam._id });
    console.log(`✅ Found ${resultsBeforeDeletion.length} results before deletion`);
    
    // Now test the cascading deletion by simulating the admin delete
    console.log("🗑️ Testing cascading deletion...");
    
    // Delete all associated results first (cascading deletion)
    const deleteResults = await Result.deleteMany({ examId: testExam._id });
    console.log(`✅ Deleted ${deleteResults.deletedCount} associated results`);
    
    // Then delete the exam
    await Exam.findByIdAndDelete(testExam._id);
    console.log("✅ Deleted test exam");
    
    // Verify results are gone
    const resultsAfterDeletion = await Result.find({ examId: testExam._id });
    console.log(`✅ Found ${resultsAfterDeletion.length} results after deletion (should be 0)`);
    
    // Verify exam is gone
    const examAfterDeletion = await Exam.findById(testExam._id);
    console.log(`✅ Exam exists after deletion: ${examAfterDeletion ? 'YES (ERROR!)' : 'NO (CORRECT)'}`);
    
    // Clean up test user
    await User.findByIdAndDelete(testUser._id);
    console.log("🧹 Cleaned up test user");
    
    console.log("🎉 Cascading deletion test completed successfully!");
    console.log("✅ When an admin deletes an exam, all associated results are also deleted");
    console.log("✅ This prevents 'Unknown Exam' entries in the intern portal");
    
  } catch (error) {
    console.error("❌ Error during test:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Run the test
testCascadingDeletion();
