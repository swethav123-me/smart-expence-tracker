import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
  <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ThemedText type="title">
      Smart Expense Tracker
    </ThemedText>

    <Pressable
     onPress={() => router.push("/add-expense")}
      style={{
        marginTop: 20,
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
      }}
    >
      <ThemedText style={{ color: "white", fontWeight: "bold" }}>
        Add Expense
      </ThemedText>
    </Pressable>

  </ThemedView>

);
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
