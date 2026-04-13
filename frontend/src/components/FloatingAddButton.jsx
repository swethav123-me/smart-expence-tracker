import React, { useState } from 'react'
import { Plus, Mic, PenTool } from 'lucide-react'

const FloatingAddButton = ({ onAddClick, onVoiceClick }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Menu Items */}
      {isOpen && (
        <>
          {/* Voice Entry Button */}
          <button
            onClick={() => {
              onVoiceClick()
              setIsOpen(false)
            }}
            className="absolute bottom-20 right-0 flex items-center gap-3 bg-primary text-white px-4 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-all animate-bounce z-50"
          >
            <Mic size={20} />
            <span className="text-sm font-medium">Voice</span>
          </button>

          {/* Manual Entry Button */}
          <button
            onClick={() => {
              onAddClick()
              setIsOpen(false)
            }}
            className="absolute bottom-40 right-0 flex items-center gap-3 bg-secondary text-white px-4 py-3 rounded-full shadow-lg hover:bg-secondary/90 transition-all z-50"
          >
            <PenTool size={20} />
            <span className="text-sm font-medium">Manual</span>
          </button>
        </>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-accent hover:bg-accent/90 text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform hover:scale-110 relative z-50"
      >
        <Plus size={28} className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default FloatingAddButton
