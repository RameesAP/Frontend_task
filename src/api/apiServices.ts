import axiosInstance from "./axiosInstance";

// Interface for quiz options
interface QuizOption {
  _id: string;
  text: string;
  question: string;
}

// Interface for a single quiz question
interface QuizQuestion {
  _id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
}

// Interface for the response structure
export interface QuizResponse {
  data: QuizQuestion[];
}

// Fetch quiz questions
export const fetchQuizQuestions = async (): Promise<QuizResponse> => {
  try {
    const response = await axiosInstance.get<QuizResponse>(
      "/api/quize/getQuestions"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    throw error;
  }
};

// Add a new quiz question currently only used thorugh the postman
export const addQuizQuestion = async (question: {
  question: string;
  options: { text: string }[];
  explanation: string;
}): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post("/api/questionAdd", question);
    return response.data;
  } catch (error) {
    console.error("Error adding quiz question:", error);
    throw error;
  }
};
