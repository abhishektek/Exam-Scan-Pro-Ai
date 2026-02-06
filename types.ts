
export interface QuestionOption {
  label: string;
  text: string;
}

export interface SubQuestion {
  id: string;
  label: string;
  text: string;
}

export interface ExtractedQuestion {
  id: string;
  questionNumber: string;
  text: string;
  options?: QuestionOption[];
  subQuestions?: SubQuestion[];
  correctAnswer?: string;
  points?: string;
}

export enum AppView {
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS'
}

export interface OCRResult {
  questions: ExtractedQuestion[];
  rawText: string;
}
