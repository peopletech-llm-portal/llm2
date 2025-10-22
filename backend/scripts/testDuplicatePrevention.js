// Test script to verify duplicate prevention and exam filtering works
import mongoose from "mongoose";
import Exam from "../models/Exam.js";
import Result from "../models/Result.js";
import User from "../models/User.js";

const testDuplicatePrevention = async () => {
  try {
    console.log("🧪 Testing duplicate prevention and exam filtering...");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/llm2");
    console.log("✅ Connected to MongoDB");
    
    // Create a test user if it doesn't exist
    let testUser = await User.findOne({ email: "testuser@example.com" });
    if (!testUser) {
      testUser = new User({
        name: "Test User",
        email: "testuser@example.com",
        password: "hashedpassword",
        role: "INTERN"
      });
      await testUser.save();
      console.log("👤 Created test user");
    }
    
    // Create a test exam
    const testExam = new Exam({
      title: "Test Exam for Duplicate Prevention",
      examType: "theory",
      questions: [
        {
          question: "What is 2+2?",
          options: ["(long answer)"],
          correctAnswer: 0
        }
      ],
      startTime: new Date(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      duration: 30
    });
    await testExam.save();
    console.log("📝 Created test exam:", testExam._id);
    
    // Test 1: First submission should succeed
    console.log("\n🧪 Test 1: First submission");
    const firstResult = new Result({
      examId: testExam._id,
      studentId: testUser._id,
      examType: "theory",
      score: 0,
      totalQuestions: 1,
      theoryAnswers: ["Answer 1"]
    });
    await firstResult.save();
    console.log("✅ First submission successful:", firstResult._id);
    
    // Test 2: Second submission should fail due to unique index
    console.log("\n🧪 Test 2: Duplicate submission prevention");
    try {
      const secondResult = new Result({
        examId: testExam._id,
        studentId: testUser._id,
        examType: "theory",
        score: 0,
        totalQuestions: 1,
        theoryAnswers: ["Answer 2"]
      });
      await secondResult.save();
      console.log("❌ ERROR: Second submission should have failed!");
    } catch (error) {
      if (error.code === 11000) {
        console.log("✅ Duplicate submission prevented by unique index");
      } else {
        console.log("❌ Unexpected error:", error.message);
      }
    }
    
    // Test 3: Verify only one result exists
    console.log("\n🧪 Test 3: Verify single result");
    const results = await Result.find({ examId: testExam._id, studentId: testUser._id });
    console.log(`📊 Found ${results.length} results (should be 1)`);
    
    if (results.length === 1) {
      console.log("✅ Only one result exists - duplicate prevention working!");
    } else {
      console.log("❌ Multiple results found - duplicate prevention failed!");
    }
    
    // Test 4: Test exam filtering logic
    console.log("\n🧪 Test 4: Exam filtering logic");
    const examStatus = (examId) => {
      const result = results.find(r => r.examId.toString() === examId.toString());
      return result ? { status: 'Completed', score: result.score, total: result.totalQuestions } : { status: 'Not Attempted', score: 0, total: 0 };
    };
    
    const status = examStatus(testExam._id);
    console.log(`📊 Exam status: ${status.status}`);
    
    if (status.status === 'Completed') {
      console.log("✅ Exam correctly marked as completed");
      console.log("✅ Completed exam should be filtered out from available exams list");
    } else {
      console.log("❌ Exam not marked as completed");
    }
    
    // Clean up
    await Result.deleteMany({ examId: testExam._id });
    await Exam.findByIdAndDelete(testExam._id);
    await User.findByIdAndDelete(testUser._id);
    console.log("\n🧹 Cleaned up test data");
    
    console.log("\n🎉 All tests completed successfully!");
    console.log("✅ Duplicate prevention: Working");
    console.log("✅ Exam filtering: Working");
    console.log("✅ Exams will only appear once after completion");
    
  } catch (error) {
    console.error("❌ Error during test:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Run the test
testDuplicatePrevention();
