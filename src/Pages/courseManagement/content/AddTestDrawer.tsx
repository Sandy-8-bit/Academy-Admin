import { useState, useMemo, type FormEvent } from "react";
import { X, Trash2, Plus } from "lucide-react";
import ButtonSm from "@/components/common/Button";
import Input from "@/components/common/Input";
import { InputCheckbox } from "@/components/common/Input";
import { useCreateTierContent } from "@/queries/contentQuery";

interface AddTestDrawerProps {
  tierId?: string;
  weekLabel: string | null;
  dayLabel: string | null;
  contentsCount: number;
  onClose: () => void;
}

interface Quiz {
  id: string;
  question: string;
  choices: string[];
  answer: string[];
  isMultiChoice: boolean;
}

const numberFromLabel = (label: string | null) => {
  if (!label) return null;
  const digitMatch = label.match(/\d+/);
  if (digitMatch) return Number(digitMatch[0]);
  const parsed = Number(label);
  return Number.isFinite(parsed) ? parsed : null;
};

const AddTestDrawer = ({
  tierId,
  weekLabel,
  dayLabel,
  contentsCount,
  onClose,
}: AddTestDrawerProps) => {
  const [title, setTitle] = useState("");
  const [testDurationSeconds, setTestDurationSeconds] = useState<string>("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const { mutate: createTierContent, isPending } = useCreateTierContent();

  const contextReady = Boolean(tierId && weekLabel && dayLabel);
  const weekNumber = useMemo(() => numberFromLabel(weekLabel), [weekLabel]);
  const dayNumber = useMemo(() => numberFromLabel(dayLabel), [dayLabel]);

  const isFormValid =
    contextReady &&
    weekNumber !== null &&
    dayNumber !== null &&
    Boolean(title.trim()) &&
    Number(testDurationSeconds) > 0 &&
    quizzes.length > 0 &&
    quizzes.every(
      (q) =>
        Boolean(q.question.trim()) &&
        q.choices.length > 0 &&
        q.choices.every((c) => Boolean(c.trim())) &&
        q.answer.length > 0
    );

  const handleAddQuiz = () => {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      question: "",
      choices: ["", ""],
      answer: [],
      isMultiChoice: false,
    };
    setQuizzes([...quizzes, newQuiz]);
  };

  const handleRemoveQuiz = (id: string) => {
    setQuizzes(quizzes.filter((q) => q.id !== id));
  };

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    setQuizzes(quizzes.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const addChoice = (quizId: string) => {
    updateQuiz(quizId, {
      choices: [...(quizzes.find((q) => q.id === quizId)?.choices ?? []), ""],
    });
  };

  const removeChoice = (quizId: string, index: number) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) return;
    const newChoices = quiz.choices.filter((_, i) => i !== index);
    updateQuiz(quizId, { choices: newChoices });
  };

  const updateChoice = (quizId: string, index: number, value: string) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) return;
    const newChoices = [...quiz.choices];
    newChoices[index] = value;
    updateQuiz(quizId, { choices: newChoices });
  };

  const toggleAnswerChoice = (quizId: string, choice: string) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) return;

    let newAnswer: string[];
    if (quiz.isMultiChoice) {
      if (quiz.answer.includes(choice)) {
        newAnswer = quiz.answer.filter((a) => a !== choice);
      } else {
        newAnswer = [...quiz.answer, choice];
      }
    } else {
      newAnswer = quiz.answer[0] === choice ? [] : [choice];
    }

    updateQuiz(quizId, { answer: newAnswer });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || !tierId || weekNumber === null || dayNumber === null)
      return;

    createTierContent(
      {
        tierId,
        payload: {
          module_type: "test",
          week: weekNumber,
          day: dayNumber,
          position: contentsCount + 1,
          test: {
            title: title.trim(),
            test_duration: Number(testDurationSeconds),
            quizzes: quizzes.map((q) => ({
              question: q.question.trim(),
              choices: q.choices.map((c) => c.trim()),
              answer: q.answer,
              isMultiChoice: q.isMultiChoice,
            })),
          },
        },
      },
      {
        onSuccess: () => {
          setTitle("");
          setTestDurationSeconds("");
          setQuizzes([]);
          onClose();
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-4 text-[#1f2937] overflow-y-auto"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
            Add Test
          </p>
          <p className="text-sm text-[#4b5563]">
            {weekLabel ?? "Select a week"} · {dayLabel ?? "Select a day"}
          </p>
        </div>
        <X
          onClick={onClose}
          className="h-4 w-4 cursor-pointer hover:text-red-500 duration-150 ease-in-out transition-all flex-shrink-0"
        />
      </div>

      {!contextReady && (
        <div className="rounded-md border border-dashed border-[#d1d3d9] bg-[#f9fafb] p-3 text-xs text-[#6b7280]">
          Select a week and day from the sidebar to add content.
        </div>
      )}

      <Input
        required
        title="Test Title"
        placeholder="e.g., Basics Quiz"
        inputValue={title}
        onChange={setTitle}
      />

      <Input
        required
        title="Test Duration (minutes)"
        type="num"
        placeholder="15"
        inputValue={testDurationSeconds}
        onChange={(value) => setTestDurationSeconds(String(value))}
        min={1}
      />

      {/* Quizzes Section */}
      <div className="space-y-3 border-t border-[#d1d3d9] pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1f2937]">
            Questions ({quizzes.length})
          </h3>
          <ButtonSm
            type="button"
            state="default"
            className="!p-2 !gap-1 text-xs"
            onClick={handleAddQuiz}
          >
            <Plus className="h-3 w-3" />
            Add Question
          </ButtonSm>
        </div>

        <div className="space-y-4">
          {quizzes.map((quiz, quizIndex) => (
            <div
              key={quiz.id}
              className="rounded-lg border border-[#d1d3d9] bg-white p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-xs font-semibold text-[#6b7280] uppercase">
                  Question {quizIndex + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => handleRemoveQuiz(quiz.id)}
                  className="text-red-500 hover:bg-red-50 p-1 rounded transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Question Input */}
              <div>
                <label className="text-xs font-semibold text-[#6b7280] block mb-1">
                  Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full rounded-xl border-2 border-[#F1F1F1] bg-white px-3 py-2 text-sm font-medium text-slate-600 focus:outline-none"
                  rows={2}
                  placeholder="What does HTML stand for?"
                  value={quiz.question}
                  onChange={(e) =>
                    updateQuiz(quiz.id, { question: e.target.value })
                  }
                  required
                />
              </div>

              {/* Question Type Toggle */}
              <InputCheckbox
                title={
                  quiz.isMultiChoice ? "Multiple Answers" : "Single Answer"
                }
                checked={quiz.isMultiChoice}
                onChange={(isMulti) =>
                  updateQuiz(quiz.id, {
                    isMultiChoice: isMulti,
                    answer: [],
                  })
                }
                label="Allow multiple correct answers?"
              />

              {/* Choices */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6b7280] block">
                  Choices <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {quiz.choices.map((choice, choiceIndex) => (
                    <div key={choiceIndex} className="flex items-center gap-2">
                      <input
                        type={quiz.isMultiChoice ? "checkbox" : "radio"}
                        name={`answer-${quiz.id}`}
                        checked={quiz.answer.includes(choice)}
                        onChange={() => toggleAnswerChoice(quiz.id, choice)}
                        className="h-4 w-4"
                        disabled={!choice.trim()}
                      />
                      <input
                        type="text"
                        className="flex-1 rounded-xl border-2 border-[#F1F1F1] bg-white px-3 py-2 text-sm font-medium text-slate-600 focus:outline-none"
                        placeholder={`Choice ${choiceIndex + 1}`}
                        value={choice}
                        onChange={(e) =>
                          updateChoice(quiz.id, choiceIndex, e.target.value)
                        }
                        required
                      />
                      {quiz.choices.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeChoice(quiz.id, choiceIndex)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <ButtonSm
                  type="button"
                  state="default"
                  className="w-full justify-center text-xs !py-2"
                  onClick={() => addChoice(quiz.id)}
                >
                  + Add Choice
                </ButtonSm>
              </div>
            </div>
          ))}
        </div>
      </div>

      {quizzes.length === 0 && (
        <div className="rounded-md border border-dashed border-[#d1d3d9] bg-[#f9fafb] p-4 text-center text-xs text-[#6b7280]">
          Add at least one question to continue.
        </div>
      )}

      <div className="mt-auto flex gap-3 pt-4 border-t border-[#d1d3d9]">
        <ButtonSm
          type="button"
          state="outline"
          className="flex-1"
          onClick={onClose}
        >
          Cancel
        </ButtonSm>
        <ButtonSm
          type="submit"
          state="default"
          className="flex-1"
          disabled={!isFormValid || isPending}
        >
          {isPending ? "Saving..." : "Save Test"}
        </ButtonSm>
      </div>
    </form>
  );
};

export default AddTestDrawer;
