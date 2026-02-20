'use client'

import { Sparkles } from 'lucide-react'
import { conversationData } from '@/lib/mock-data'

export function AIAssistantPreview() {
  return (
    <div className="bg-white rounded-xl border border-slate-100/80 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.05),0_1px_6px_-2px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/60">
        <div className="p-2 rounded-lg bg-indigo-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Inventory Assistant</h3>
          <p className="text-xs text-slate-400">Ask questions about your inventory</p>
        </div>
      </div>

      <div className="p-5 space-y-3 max-h-[480px] overflow-y-auto">
        {conversationData.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                message.role === 'user'
                  ? 'bg-slate-100 text-slate-800'
                  : 'bg-white text-slate-700 border border-slate-100 shadow-sm shadow-black/[0.02]'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        <div className="flex justify-start">
          <div className="bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm shadow-black/[0.02]">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              </div>
              <span className="text-xs text-slate-400 ml-1">Analyzing...</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about inventory, demand trends, or reorder suggestions..."
            className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow duration-150"
            aria-label="Message input"
          />
          <button
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Powered by machine learning trained on your sales data
        </p>
      </div>
    </div>
  )
}
