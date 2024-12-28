import { useQuery } from "@tanstack/react-query";
import { fetchQuizQuestions } from "./api/apiServices";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { useState } from "react";

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: { [key: number]: number | null }; // Store selected answers for each question
  showExplanation: boolean;
}

function App() {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: {}, // Initialize an empty object
    showExplanation: false,
  });

  const { data, isLoading, error } = useQuery<QuizResponse, Error>(
    ["quizQuestions"],
    fetchQuizQuestions
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error instanceof Error)
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {error.message}
      </div>
    );
  if (!data) return null;

  const currentQuestion = data.data[state.currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    setState((prev) => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [state.currentQuestionIndex]: index, // Store the selected answer for the current question
      },
    }));
  };

  const handleExplanationToggle = () => {
    setState((prev) => ({
      ...prev,
      showExplanation: !prev.showExplanation,
    }));
  };

  const handleNavigation = (direction: "prev" | "next") => {
    setState((prev) => ({
      ...prev,
      currentQuestionIndex:
        direction === "next"
          ? Math.min(prev.currentQuestionIndex + 1, data.data.length - 1)
          : Math.max(prev.currentQuestionIndex - 1, 0),
      showExplanation: false, // Reset explanation visibility on navigation
    }));
  };
  const handleQnoClick=(index:number)=>{
    setState((prev) => ({
      ...prev,
      currentQuestionIndex:index,
    }));
  }

  return (
    <>
      <div className="flex items-center justify-center font-bold mt-5">
        Quiz Title
      </div>
      <div className="max-w-6xl mx-auto p-4 flex gap-6">
        <Card className="flex-1 border border-none shadow-none">
          <CardContent>
            <div className="border-2 border-blue-400 p-3 rounded-lg mb-3">
              <div className="mb-3 font-bold">
                Question {state.currentQuestionIndex + 1}
              </div>
              <div className="mb-6 text-lg font-medium">
                {currentQuestion.question}
              </div>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option: any, index: number) => (
                <button
                  key={option._id}
                  onClick={() => handleOptionClick(index)}
                  className={`w-full p-4 text-left rounded-lg border transition-colors duration-200 shadow-md
                  ${
                    state.selectedAnswers[state.currentQuestionIndex] === index
                      ? state.showExplanation
                        ? option.correct
                          ? "bg-green-100 border-green-300"
                          : "bg-red-100 border-red-300"
                        : "bg-blue-100 border-blue-300"
                      : "bg-white hover:bg-blue-50"
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-8 mt-6">
              <Button
                className="bg-white text-black shadow-md hover:bg-slate-300 "
                onClick={() => handleNavigation("prev")}
                disabled={state.currentQuestionIndex === 0}
              >
                Prev
              </Button>
              <Button
                className="bg-white text-black shadow-md hover:bg-slate-300 "
                onClick={() => handleNavigation("next")}
                disabled={state.currentQuestionIndex === data.data.length - 1}
              >
                Next
              </Button>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                onClick={handleExplanationToggle}
                className="w-full"
              >
                {state.showExplanation ? "Hide" : "Show"} Explanation
              </Button>
              {state.showExplanation && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  {currentQuestion.explanation}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="w-72 hidden md:block border px-3 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4 mt-2">
            <div>
              Question {state.currentQuestionIndex + 1}/{data.data.length}
            </div>
            <Button variant="link">Need Help?</Button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {data.data.map((_, index: number) => (
              <div
                key={index}
                // onClick={handleQnoClick(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm border border-red-500
                ${
                  index === state.currentQuestionIndex
                    ? "bg-red-500 text-white"
                    : index < state.currentQuestionIndex
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

interface QuizOption {
  _id: string;
  text: string;
  correct?: boolean; // Optional: used for correct answers
}

interface QuizQuestion {
  _id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
}

interface QuizResponse {
  data: QuizQuestion[];
}



// import { useQuery } from "@tanstack/react-query";
// import { fetchQuizQuestions } from "./api/apiServices";
// import { Button } from "./components/ui/button";
// import { Card, CardContent } from "./components/ui/card";
// import { useState } from "react";

// export interface QuizState {
//   currentQuestionIndex: number;
//   selectedAnswerIndex: number | null;
//   showExplanation: boolean;
// }

// function App() {
//   const [state, setState] = useState<QuizState>({
//     currentQuestionIndex: 0,
//     selectedAnswerIndex: null,
//     showExplanation: false,
//   });

//   // UseQuery with typed response (QuizResponse) and error (Error)
//   const { data, isLoading, error } = useQuery<QuizResponse, Error>(
//     ["quizQuestions"],
//     fetchQuizQuestions
//   );

//   // Handle loading and error states
//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Loading...
//       </div>
//     );
//   if (error instanceof Error)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Error: {error.message}
//       </div>
//     );
//   if (!data) return null;

//   const currentQuestion = data.data[state.currentQuestionIndex];

//   const handleOptionClick = (index: number) => {
//     setState((prev) => ({ ...prev, selectedAnswerIndex: index }));
//   };

//   const handleExplanationToggle = () => {
//     setState((prev) => ({ ...prev, showExplanation: !prev.showExplanation }));
//   };

//   const handleNavigation = (direction: "prev" | "next") => {
//     setState((prev) => ({
//       currentQuestionIndex:
//         direction === "next"
//           ? Math.min(prev.currentQuestionIndex + 1, data.data.length - 1)
//           : Math.max(prev.currentQuestionIndex - 1, 0),
//       selectedAnswerIndex: null,
//       showExplanation: false,
//     }));
//   };

//   return (
//     <>
//       <div className="flex items-center justify-center font-bold">
//         Quiz Title
//       </div>
//       <div className="max-w-6xl mx-auto p-4 flex gap-6 ">
//         <Card className="flex-1 border border-none shadow-none">
//           <CardContent>
//             <div className="border-2 border-blue-400 p-3 rounded-lg mb-3">
//               <div className="mb-3 font-bold">
//                 Question {state.currentQuestionIndex + 1}
//               </div>
//               <div className="mb-6 text-lg font-medium">
//                 {currentQuestion.question}
//               </div>
//             </div>

//             <div className="space-y-3">
//               {currentQuestion.options.map((option: any, index: any) => (
//                 <button
//                   key={option._id}
//                   onClick={() => handleOptionClick(index)}
//                   className={`w-full p-4 text-left rounded-lg border transition-colors duration-200 shadow-md
//                   ${
//                     state.selectedAnswerIndex === index
//                       ? state.showExplanation
//                         ? option.correct
//                           ? "bg-green-100 border-green-300"
//                           : "bg-red-100 border-red-300"
//                         : "bg-blue-100 border-blue-300"
//                       : "bg-white hover:bg-blue-50"
//                   }`}
//                 >
//                   {option.text}
//                 </button>
//               ))}
//             </div>

//             <div className="flex items-center justify-center gap-8 mt-6">
//               <Button
//                 className="bg-white text-black shadow-md hover:bg-slate-300 "
//                 onClick={() => handleNavigation("prev")}
//                 disabled={state.currentQuestionIndex === 0}
//               >
//                 Prev
//               </Button>
//               <Button
//                 className="bg-white text-black shadow-md hover:bg-slate-300 "
//                 onClick={() => handleNavigation("next")}
//                 disabled={state.currentQuestionIndex === data.data.length - 1}
//               >
//                 Next
//               </Button>
//             </div>

//             <div className="mt-6">
//               <Button
//                 variant="outline"
//                 onClick={handleExplanationToggle}
//                 className="w-full"
//               >
//                 {state.showExplanation ? "Hide" : "Show"} Explanation
//               </Button>
//               {state.showExplanation && (
//                 <div className="mt-4 p-4 bg-gray-100 rounded-lg">
//                   {currentQuestion.explanation}
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//         <div className="w-72 hidden md:block border px-3 rounded-lg shadow-md ">
//           <div className="flex items-center justify-between mb-4 mt-2">
//             <div>
//               Question {state.currentQuestionIndex + 1}/{data.data.length}
//             </div>
//             <Button variant="link">Need Help?</Button>
//           </div>
//           <div className="grid grid-cols-5 gap-2">
//             {data.data.map((_: any, index: any) => (
//               <div
//                 key={index}
//                 className={`w-10 h-10 rounded-full flex items-center justify-center text-sm
//                     ${
//                       index === state.currentQuestionIndex
//                         ? "bg-red-500 text-white"
//                         : index < state.currentQuestionIndex
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-200 text-gray-600"
//                     }`}
//               >
//                 {index + 1}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;

// interface QuizOption {
//   _id: string;
//   text: string;
// }

// interface QuizQuestion {
//   _id: string;
//   question: string;
//   options: QuizOption[];
//   explanation: string;
// }

// interface QuizResponse {
//   data: QuizQuestion[];
// }
