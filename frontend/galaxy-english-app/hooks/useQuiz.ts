// hooks/useQuiz.ts — Quiz state machine
"use client";
import { useState, useCallback } from "react";
import type { QuizQuestion, QuizResult } from "@/types";

export function useQuiz(questions: QuizQuestion[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selected: number; correct: boolean }[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const selectAnswer = useCallback((optionIndex: number) => {
    if (selectedOption !== null) return;
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    setSelectedOption(optionIndex);
    setAnswers(prev => [...prev, { questionId: currentQuestion.id, selected: optionIndex, correct: isCorrect }]);

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        setIsFinished(true);
      } else {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
      }
    }, 900);
  }, [currentIndex, currentQuestion, questions.length, selectedOption]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setIsFinished(false);
  }, []);

  const result: QuizResult = {
    totalQuestions: questions.length,
    correct: answers.filter(a => a.correct).length,
    score: Math.round((answers.filter(a => a.correct).length / questions.length) * 100),
    timeTaken: Math.round((Date.now() - startTime) / 1000),
    answers,
  };

  return {
    currentQuestion,
    currentIndex,
    selectedOption,
    isFinished,
    progress,
    result,
    selectAnswer,
    restart,
  };
}
