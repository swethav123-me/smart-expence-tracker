/**
 * Smart Expense Tracker - Voice & Text Parser
 * Extracts amount, category, and type from natural language input
 * Enhanced with Indian English support, number word parsing, and improved accuracy
 */

// Written numbers mapping (supports both English and Indian numbering system)
const WRITTEN_NUMBERS = {
  // Basic numbers
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  // Tens
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90,
  // Scales
  hundred: 100, thousand: 1000, lakh: 100000, crore: 10000000,
}

// Category keyword mappings with Indian-specific terms
const CATEGORY_KEYWORDS = {
  Food: ['pizza', 'food', 'lunch', 'dinner', 'breakfast', 'snacks', 'restaurant', 'cafe', 'burger', 'chicken', 'biryani', 'dosa', 'idli', 'samosa', 'coffee', 'tea', 'drink', 'meal', 'dhaba', 'eating', 'ate', 'eat', 'mess', 'chaat', 'paratha', 'thali', 'paneer', 'butter chicken', 'naan', 'rice'],
  Transport: ['bus', 'uber', 'taxi', 'auto', 'metro', 'train', 'bike', 'car', 'petrol', 'fuel', 'parking', 'toll', 'commute', 'travel', 'transport', 'vehicle', 'auto rickshaw', 'ola', 'drive', 'drove', 'driving'],
  Shopping: ['shopping', 'amazon', 'clothes', 'dress', 'shirt', 'shoes', 'pants', 'mall', 'store', 'shop', 'buy', 'purchase', 'apparel', 'fashion', 'garment', 'flipkart', 'boutique', 'buying', 'bought', 'shopping mall'],
  Salary: ['salary', 'income', 'payment', 'received', 'bonus', 'earning', 'wage', 'stipend', 'paycheck', 'allowance', 'payroll'],
  Bills: ['bill', 'electricity', 'water', 'gas', 'internet', 'phone', 'mobile', 'subscription', 'utility', 'rent', 'maintenance', 'bill payment'],
  Health: ['doctor', 'medicine', 'pharmacy', 'hospital', 'health', 'dental', 'clinic', 'treatment', 'medical', 'checkup', 'therapy', 'doctor visit'],
  Education: ['school', 'college', 'course', 'tuition', 'books', 'education', 'exam', 'training', 'learning', 'fees', 'institute', 'university'],
  Entertainment: ['movie', 'cinema', 'show', 'game', 'sport', 'music', 'concert', 'ticket', 'fun', 'party', 'entertainment', 'outing', 'movie ticket', 'gaming'],
}

// Type keywords with improved detection
const TYPE_KEYWORDS = {
  income: ['received', 'earned', 'got', 'salary', 'bonus', 'income', 'refund', 'credited', 'payment received', 'earned money'],
  expense: ['spent', 'paid', 'cost', 'charged', 'bought', 'purchased', 'expense', 'spent on', 'paid for'],
  transfer: ['transferred', 'moved', 'sent', 'transfer'],
}

/**
 * Parse written number words to digits
 * Supports English and Indian numbering system
 * Examples: "fifty" → 50, "one lakh" → 100000, "five thousand" → 5000
 */
const parseWrittenNumber = (text) => {
  const words = text.toLowerCase().split(/\s+/)
  let total = 0
  let current = 0

  for (const word of words) {
    if (word in WRITTEN_NUMBERS) {
      const value = WRITTEN_NUMBERS[word]
      
      if (value >= 1000) {
        // Lakh, crore, thousand
        current = (current + 1) * value
        total += current
        current = 0
      } else if (value >= 100) {
        // Hundred
        current = (current + 1) * value
      } else {
        // Regular numbers
        current += value
      }
    }
  }

  total += current
  return total > 0 ? total : null
}

/**
 * Extract amount from text using regex and word parsing
 * @param {string} text - Input text
 * @returns {number|null} Extracted amount or null
 */
export const extractAmount = (text) => {
  // Try digit-based patterns first (faster)
  const digitPatterns = [
    /₹?\s*(\d+(?:\.\d{2})?)\s*(rupees?|rs|bucks|dollars?)?/i,
    /\$?\s*(\d+(?:\.\d{2})?)/i,
  ]

  for (const pattern of digitPatterns) {
    const match = text.match(pattern)
    if (match) {
      return parseFloat(match[1])
    }
  }

  // Try spelled-out numbers (e.g., "fifty rupees", "one lakh")
  const wordAmount = parseWrittenNumber(text)
  if (wordAmount) return wordAmount

  return null
}

/**
 * Detect transaction type from text
 * @param {string} text - Input text
 * @returns {string} Type: 'income' | 'expense' | 'transfer'
 */
export const detectType = (text) => {
  const lowerText = text.toLowerCase()

  for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return type
      }
    }
  }

  // Default to expense if no type detected
  return 'expense'
}

/**
 * Auto-categorize based on keywords with scoring
 * @param {string} text - Input text
 * @returns {string} Category name
 */
export const detectCategory = (text) => {
  const lowerText = text.toLowerCase()
  const scores = {}

  // Score each category based on keyword matches
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        score += 1
      }
    }
    scores[category] = score
  }

  // Return category with highest score
  const topCategory = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)[0]

  return topCategory ? topCategory[0] : 'Shopping'
}

/**
 * Parse natural language input and extract transaction details
 * Enhanced with better confidence scoring
 * @param {string} text - User input text
 * @returns {object} Parsed transaction {amount, category, type, confidence, transcript}
 */
export const parseExpense = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      amount: null,
      category: 'Shopping',
      type: 'expense',
      confidence: 0,
      transcript: text,
      error: 'Invalid input'
    }
  }

  const amount = extractAmount(text)
  const type = detectType(text)
  const category = detectCategory(text)

  // Enhanced confidence score calculation (0-100)
  let confidence = 0
  const lowerText = text.toLowerCase()

  // Amount confidence (0-50 points)
  if (amount) {
    confidence += 40
    if (amount > 0 && amount < 1000000) confidence += 10 // Reasonable amount
  }

  // Category confidence (0-30 points)
  let categoryMatches = 0
  for (const keyword of CATEGORY_KEYWORDS[category] || []) {
    if (lowerText.includes(keyword)) categoryMatches++
  }
  confidence += Math.min(categoryMatches * 10, 30)

  // Type confidence (0-20 points)
  if (type !== 'expense') {
    confidence += 20
  } else if (lowerText.includes('spent') || lowerText.includes('paid')) {
    confidence += 15
  }

  return {
    amount,
    category,
    type,
    confidence: Math.min(confidence, 100),
    transcript: text, // Include full transcript for display
  }
}
