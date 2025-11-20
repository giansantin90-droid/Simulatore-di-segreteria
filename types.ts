import { Type } from "@google/genai";

export enum StudioType {
  LEGAL = 'Studio Legale',
  MEDICAL = 'Studio Medico',
  ARCHITECT = 'Studio Architettura',
  ACCOUNTING = 'Studio Commercialista'
}

export enum TaskType {
  EMAIL_REPLY = 'EMAIL_REPLY',
  CALENDAR_FIX = 'CALENDAR_FIX',
  DOCUMENT_DRAFT = 'DOCUMENT_DRAFT',
  CHAT_RESPONSE = 'CHAT_RESPONSE'
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  isRead: boolean;
  date: string;
  priority: 'High' | 'Normal' | 'Low';
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
  type: 'meeting' | 'call' | 'personal';
  description?: string;
}

export interface DailyScenario {
  id: string;
  month: number;
  dayTitle: string;
  description: string;
  emails: Email[];
  events: CalendarEvent[];
  objective: string;
  difficulty: number;
}

export interface SimulationState {
  currentMonth: number;
  selectedStudio: StudioType | null;
  currentScenario: DailyScenario | null;
  completedScenarios: string[];
  score: number;
  feedbackHistory: FeedbackItem[];
}

export interface FeedbackItem {
  scenarioId: string;
  taskType: TaskType;
  userAction: string;
  aiFeedback: string;
  score: number; // 1-100
}

export const STUDIO_THEMES: Record<StudioType, { primary: string, secondary: string, icon: string }> = {
  [StudioType.LEGAL]: { primary: 'bg-slate-900', secondary: 'text-slate-900', icon: 'scale' },
  [StudioType.MEDICAL]: { primary: 'bg-teal-700', secondary: 'text-teal-700', icon: 'stethoscope' },
  [StudioType.ARCHITECT]: { primary: 'bg-orange-600', secondary: 'text-orange-600', icon: 'ruler' },
  [StudioType.ACCOUNTING]: { primary: 'bg-blue-800', secondary: 'text-blue-800', icon: 'calculator' },
};
