"use client";

import { motion } from "framer-motion";

interface AIAnalyticsToggleSectionProps {
  showAIAnalytics: boolean;
  setShowAIAnalytics: (show: boolean) => void;
  isVisible: boolean;
}

export default function AIAnalyticsToggleSection(props: AIAnalyticsToggleSectionProps) {
  if (!props.isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-4"
    >
      <button
        onClick={() => props.setShowAIAnalytics(!props.showAIAnalytics)}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span className="text-lg">
          {props.showAIAnalytics ? 'Hide' : 'Show'} Advanced AI Analytics & Predictions
        </span>
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${props.showAIAnalytics ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </motion.div>
  );
}