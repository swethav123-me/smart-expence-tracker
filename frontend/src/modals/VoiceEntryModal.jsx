import React, { useState, useRef } from 'react'
import { X, Mic, Volume2, AlertCircle } from 'lucide-react'
import { parseExpense } from '../services/voiceParser'
import { useData } from '../context/DataContext'

const VoiceEntryModal = ({ onClose }) => {
  const { addRecord, accounts, categories } = useData()
  
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [parsed, setParsed] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const recognitionRef = useRef(null)
  const transcriptRef = useRef('')

  // Initialize Web Speech API with Indian English support
  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in this browser')
      return null
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.language = 'en-IN' // Changed to Indian English for better accuracy

    recognition.onstart = () => {
      setIsListening(true)
      setError('')
      setTranscript('')
      transcriptRef.current = ''
    }

    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          interim += transcriptSegment
        } else {
          interim += transcriptSegment
        }
      }
      setTranscript(interim)
      transcriptRef.current = interim
    }

    recognition.onerror = (event) => {
      setError(`Error: ${event.error}. Please try again.`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      console.log('Voice recording ended, transcript from ref:', transcriptRef.current)
      if (transcriptRef.current) {
        handleParse(transcriptRef.current)
      }
    }

    return recognition
  }

  const startListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition()
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }
    setIsListening(false)
  }

  const handleParse = (text) => {
    console.log('Parsing text:', text)
    const result = parseExpense(text)
    console.log('Parsed result:', result)
    setParsed(result)
  }

   const handleConfirm = async () => {
     if (!parsed || !parsed.amount) {
       setError('Could not extract amount from speech. Please try again.')
       return
     }

     setLoading(true)
     
     // Find category ID with flexible matching
     let category = categories.find(c => c.category_name === parsed.category)
     
     // If exact match not found, try case-insensitive match
     if (!category) {
       category = categories.find(c => c.category_name?.toLowerCase() === parsed.category?.toLowerCase())
     }
     
     // If still not found, use the first category of the same type
     if (!category) {
       const type = parsed.type === 'income' ? 'income' : 'expense'
       category = categories.find(c => c.category_type === type)
     }
     
     const categoryId = category ? category.id : null

    // Use first account by default
    const accountId = accounts[0]?.id

    console.log('Voice Entry - Saving record:', {
      amount: parsed.amount,
      type: parsed.type,
      category_id: categoryId,
      account_id: accountId,
      note: transcript,
      date: new Date().toISOString(),
    })

    const result = await addRecord({
      amount: parsed.amount,
      type: parsed.type,
      category_id: categoryId,
      account_id: accountId,
      note: transcript,
      date: new Date().toISOString(),
    })

    console.log('Voice Entry - Result:', result)

    if (result.success) {
      setError('')
      onClose()
    } else {
      setError(result.error || 'Failed to save record')
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-dark dark:text-light">Voice Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm flex gap-2">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!parsed ? (
            // Voice Recording Section
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isListening ? 'bg-red-100 animate-pulse' : 'bg-primary/10'
                }`}>
                  <Mic className={`${isListening ? 'text-red-600 animate-bounce' : 'text-primary'}`} size={48} />
                </div>
              </div>

              <p className="text-lg font-semibold text-dark dark:text-light mb-2">
                {isListening ? '🎤 Listening...' : 'Ready to listen'}
              </p>
              
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                {transcript || 'Speak naturally in English or Indian English. Example: "I spent 250 on groceries"'}
              </p>

              {transcript && (
                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-dark dark:text-light italic text-sm">"{transcript}"</p>
                </div>
              )}

              <div className="flex gap-3 flex-col sm:flex-row">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isListening}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                    isListening
                      ? 'bg-red-600 text-white cursor-wait'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {isListening ? 'Listening...' : 'Start Recording'}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-light rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Preview & Confirmation Section
            <div>
              <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">Confirm Details</h3>
              
              {/* Show what was heard */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">You said:</p>
                <p className="text-base font-medium text-dark dark:text-light italic">"{parsed.transcript}"</p>
              </div>

              {/* Parsed Details */}
              <div className="space-y-3 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                  <p className="text-2xl font-bold text-dark dark:text-light">₹{parsed.amount?.toFixed(2)}</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</p>
                  <p className="text-xl font-semibold text-primary">{parsed.category}</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Type</p>
                  <p className={`text-xl font-semibold ${parsed.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {parsed.type.charAt(0).toUpperCase() + parsed.type.slice(1)}
                  </p>
                </div>

                {/* Confidence Score */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Confidence</p>
                    <p className="text-sm font-semibold text-dark dark:text-light">{parsed.confidence}%</p>
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        parsed.confidence >= 75 ? 'bg-green-500' : parsed.confidence >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${parsed.confidence}%` }}
                    />
                  </div>
                  {parsed.confidence < 60 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                      ⚠️ Low confidence - details may be inaccurate
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 flex-col sm:flex-row">
                <button
                  onClick={() => setParsed(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-light rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Try Again
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Confirm & Save'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VoiceEntryModal
