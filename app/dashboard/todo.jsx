import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TodoScreen = () => {
  const router = useRouter();
  const [newTodo, setNewTodo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Complete React Native project",
      completed: false,
      category: "work",
      priority: "high",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Buy groceries for dinner",
      completed: true,
      category: "personal",
      priority: "medium",
      date: "2024-01-14",
    },
    {
      id: 3,
      title: "Call mom",
      completed: false,
      category: "personal",
      priority: "high",
      date: "2024-01-16",
    },
    {
      id: 4,
      title: "Review code changes",
      completed: false,
      category: "work",
      priority: "medium",
      date: "2024-01-15",
    },
    {
      id: 5,
      title: "Go to gym",
      completed: false,
      category: "health",
      priority: "low",
      date: "2024-01-15",
    },
  ]);

  const categories = [
    { id: "all", name: "All", icon: "list", color: "#3498db" },
    { id: "work", name: "Work", icon: "briefcase", color: "#e74c3c" },
    { id: "personal", name: "Personal", icon: "person", color: "#f39c12" },
    { id: "health", name: "Health", icon: "fitness", color: "#27ae60" },
  ];

  const priorities = {
    high: { color: "#e74c3c", label: "High" },
    medium: { color: "#f39c12", label: "Medium" },
    low: { color: "#27ae60", label: "Low" },
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        title: newTodo.trim(),
        completed: false,
        category: selectedCategory === "all" ? "personal" : selectedCategory,
        priority: "medium",
        date: new Date().toISOString().split("T")[0],
      };
      setTodos([todo, ...todos]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    Alert.alert(
      "Delete Todo",
      "Are you sure you want to delete this todo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setTodos(todos.filter((todo) => todo.id !== id)),
        },
      ]
    );
  };

  const filteredTodos = todos.filter((todo) =>
    selectedCategory === "all" ? true : todo.category === selectedCategory
  );

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  const renderTodo = ({ item }) => (
    <View style={styles.todoCard}>
      <TouchableOpacity
        style={styles.todoContent}
        onPress={() => toggleTodo(item.id)}
      >
        <View style={styles.todoLeft}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              item.completed && styles.checkboxCompleted,
            ]}
            onPress={() => toggleTodo(item.id)}
          >
            {item.completed && (
              <Ionicons name="checkmark" size={16} color="#ffffff" />
            )}
          </TouchableOpacity>
          <View style={styles.todoTextContainer}>
            <Text
              style={[
                styles.todoTitle,
                item.completed && styles.todoTitleCompleted,
              ]}
            >
              {item.title}
            </Text>
            <View style={styles.todoMeta}>
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: priorities[item.priority].color },
                ]}
              >
                <Text style={styles.priorityText}>
                  {priorities[item.priority].label}
                </Text>
              </View>
              <Text style={styles.todoDate}>{item.date}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTodo(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Todos</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.push("/auth/login")}
          >
            <Ionicons name="log-out-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {completedCount} of {totalCount} completed
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(completedCount / totalCount) * 100}%` },
              ]}
            />
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryActive,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Ionicons
                    name={category.icon}
                    size={20}
                    color={
                      selectedCategory === category.id ? "#ffffff" : category.color
                    }
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category.id && styles.categoryTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Add Todo */}
          <View style={styles.addTodoContainer}>
            <View style={styles.addTodoInput}>
              <TextInput
                style={styles.input}
                placeholder="Add a new todo..."
                value={newTodo}
                onChangeText={setNewTodo}
                onSubmitEditing={addTodo}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={addTodo}
                disabled={!newTodo.trim()}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={newTodo.trim() ? "#ffffff" : "#bdc3c7"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Todo List */}
          <View style={styles.todoListContainer}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === "all" ? "All Todos" : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Todos`}
            </Text>
            {filteredTodos.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle" size={64} color="#bdc3c7" />
                <Text style={styles.emptyText}>No todos found</Text>
                <Text style={styles.emptySubtext}>
                  {selectedCategory === "all"
                    ? "Add a new todo to get started!"
                    : `No ${selectedCategory} todos yet`}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredTodos}
                renderItem={renderTodo}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#2c3e50",
    paddingTop: StatusBar.currentHeight || 0,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  logoutButton: {
    padding: 8,
  },
  progressContainer: {
    marginTop: 15,
  },
  progressText: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#27ae60",
    borderRadius: 3,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  categoriesContainer: {
    paddingVertical: 30,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryActive: {
    backgroundColor: "#3498db",
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
  },
  categoryTextActive: {
    color: "#ffffff",
  },
  addTodoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addTodoInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    height: 50,
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 8,
    borderRadius: 10,
    marginRight: 5,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  todoListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  todoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  todoContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  todoLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#bdc3c7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  checkboxCompleted: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },
  todoTextContainer: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  todoTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#7f8c8d",
  },
  todoMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 10,
  },
  priorityText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },
  todoDate: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7f8c8d",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bdc3c7",
    marginTop: 8,
    textAlign: "center",
  },
});

export default TodoScreen;