'use client'

import { Sparkles } from 'lucide-react'
import { conversationData } from '@/lib/mock-data'

export function AIAssistantPreview() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
        <div className="p-2 rounded-lg bg-indigo-600">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Inventory Assistant</h3>
          <p className="text-sm text-slate-500">Ask questions about your inventory</p>
        </div>
      </div>

      <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto bg-slate-50/30">
        {conversationData.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-slate-200 text-slate-900'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
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
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <div className="w-2 h-2 rounded-full bg-slate-400" />
              </div>
              <span className="text-xs text-slate-500 ml-1">Analyzing...</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about inventory, demand trends, or reorder suggestions..."
            className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow duration-200"
            aria-label="Message input"
          />
          <button
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Powered by machine learning trained on your sales data
        </p>
      </div>
    </div>
  )
}
