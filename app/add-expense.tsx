import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";

export default function AddExpense() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const [expenses, setExpenses] = useState<
  { amount: string; category: string }[]
>([]);
const totalSpent = expenses.reduce(
  (sum, item) => sum + Number(item.amount),
  0
);

//text intput-----------
   const handleSave = () => {
    if (!amount || !category) {
      Alert.alert("Error", "Please enter both amount and category");
      return;
    }

     const newExpense = { amount, category };

     setExpenses([...expenses, newExpense]);

    setAmount("");
    setCategory("");
  };
//voice--------------
const handleVoiceInput = () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recognition.onresult = (event: any) => {
   const transcript = event.results[0][0].transcript.toLowerCase();
const words = transcript.split(" ");

// Find number
const numberWord = words.find(word => /^\d+$/.test(word));

if (!numberWord) return;

const amount = numberWord;


// Words to ignore
const ignoreWords = [
  "i", "spent", "rupees", "rs", "on",
  "for", "the", "a", "today", "yesterday"
];

// Remove number and ignore words
const filteredWords = words.filter(
  word =>
    isNaN(Number(word)) &&
    !ignoreWords.includes(word)
);

// Take last meaningful word as category
let categoryWord = filteredWords[filteredWords.length - 1];

if (!categoryWord) {
  categoryWord = "Other";
}

// Capitalize
const detectedCategory =
  categoryWord.charAt(0).toUpperCase() +
  categoryWord.slice(1);

const newExpense = {
  amount: amount,
  category: detectedCategory,
};

setExpenses(prev => [...prev, newExpense]);
  };

  recognition.start();
};



  return (
    
        <ScrollView
           contentContainerStyle={{
              padding: 20,
              backgroundColor: "#f5f5f5"
    }}
  >
    
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Add Expense
      </Text>

      <TextInput
        placeholder="Enter Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 15,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Enter Category"
        value={category}
        onChangeText={setCategory}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 20,
          borderRadius: 8,
        }}
      />

      <Pressable
      onPress={() => handleSave()}
       style={{
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 15,
  }}
>

      
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Save Expense 
        </Text>
      </Pressable>

      
      <Pressable
      
        onPress={handleVoiceInput}
        style={{
          backgroundColor: "#2196F3",
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 40,
          
          marginBottom: 15,
          alignSelf: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          🎤 Voice Input
        </Text>
      </Pressable>

    <View style={{ marginTop: 30 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
       Total Spent: ₹{totalSpent}
      </Text>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
       Recent Expenses:
      </Text>

           {expenses.map((item, index) => (
         <View
         key={index}
          style={{
  backgroundColor: "#ffffff",
  padding: 15,
  borderRadius: 12,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: "#ddd",
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 4,
}}
    >
      <Text>
        ₹{item.amount} - {item.category}
      </Text>
    </View>
  ))}


</View>
</ScrollView>
);
}
