import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoCategory, setTodoCategory] = useState("personal");
  const [todoPriority, setTodoPriority] = useState("medium");

  // API States
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingTodo, setCreatingTodo] = useState(false);
  const [togglingTodo, setTogglingTodo] = useState(null);
  const [deletingTodo, setDeletingTodo] = useState(null);
  const [token, setToken] = useState(null);

  // API Base URL
  const API_BASE_URL = "https://node-starter-temlate.onrender.com/api/v1";

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

  // Get token from storage
  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        setToken(storedToken);
      } catch (error) {
        console.log("Error getting token:", error);
      }
    };
    getToken();
  }, []);

  // Fetch todos
  const fetchTodos = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          category: selectedCategory,
        },
      });

      if (response.status === 200) {
        setTodos(response.data.notes || []);
      }
    } catch (error) {
      console.log("Error fetching todos:", error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        await AsyncStorage.removeItem("userToken");
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  }, [token, selectedCategory, router]);

  // Fetch todos on mount and when category changes
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Refresh todos
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTodos();
    setRefreshing(false);
  }, [fetchTodos]);

  const openAddModal = () => {
    setShowAddModal(true);
    setTodoTitle("");
    setTodoCategory("personal");
    setTodoPriority("medium");
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setTodoTitle("");
    setTodoCategory("personal");
    setTodoPriority("medium");
  };

  const createTodo = async () => {
    if (!todoTitle.trim() || !token) return;

    try {
      setCreatingTodo(true);
      const response = await axios.post(
        `${API_BASE_URL}/notes`,
        {
          title: todoTitle.trim(),
          category: todoCategory,
          priority: todoPriority,
          date: new Date().toISOString().split("T")[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        // Add new todo to the beginning of the list
        setTodos([response.data.note, ...todos]);
        closeAddModal();
      }
    } catch (error) {
      console.log("Error creating todo:", error);
      Alert.alert("Error", "Failed to create todo. Please try again.");
    } finally {
      setCreatingTodo(false);
    }
  };

  const toggleTodo = async (id) => {
    if (!token) return;

    try {
      setTogglingTodo(id);
      const response = await axios.patch(
        `${API_BASE_URL}/notes/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the todo in the list
        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, completed: !todo.completed } : todo
          )
        );
      }
    } catch (error) {
      console.log("Error toggling todo:", error);
      Alert.alert("Error", "Failed to update todo. Please try again.");
    } finally {
      setTogglingTodo(null);
    }
  };

  const deleteTodo = async (id) => {
    if (!token) return;

    Alert.alert(
      "Delete Todo",
      "Are you sure you want to delete this todo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingTodo(id);
              const response = await axios.delete(`${API_BASE_URL}/notes/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (response.status === 200) {
                // Remove the todo from the list
                setTodos(todos.filter((todo) => todo._id !== id));
              }
            } catch (error) {
              console.log("Error deleting todo:", error);
              Alert.alert("Error", "Failed to delete todo. Please try again.");
            } finally {
              setDeletingTodo(null);
            }
          },
        },
      ]
    );
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      router.push("/auth/login");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  const renderTodo = ({ item }) => (
    <View style={styles.todoCard}>
      <TouchableOpacity
        style={styles.todoContent}
        onPress={() => toggleTodo(item._id)}
        disabled={togglingTodo === item._id}
      >
        <View style={styles.todoLeft}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              item.completed && styles.checkboxCompleted,
            ]}
            onPress={() => toggleTodo(item._id)}
            disabled={togglingTodo === item._id}
          >
            {togglingTodo === item._id ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : item.completed ? (
              <Ionicons name="checkmark" size={16} color="#ffffff" />
            ) : null}
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
          onPress={() => deleteTodo(item._id)}
          disabled={deletingTodo === item._id}
        >
          {deletingTodo === item._id ? (
            <ActivityIndicator size="small" color="#e74c3c" />
          ) : (
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          )}
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
             onPress={logout}
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
         <ScrollView 
           style={styles.scrollView} 
           showsVerticalScrollIndicator={false}
           refreshControl={
             <RefreshControl
               refreshing={refreshing}
               onRefresh={onRefresh}
               colors={["#3498db"]}
               tintColor="#3498db"
             />
           }
         >
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
                 returnKeyType="done"
               />
                             <TouchableOpacity
                 style={styles.addButton}
                 onPress={openAddModal}
               >
                 <Ionicons
                   name="add"
                   size={20}
                   color="#ffffff"
                 />
               </TouchableOpacity>
            </View>
          </View>

                     {/* Todo List */}
           <View style={styles.todoListContainer}>
             <Text style={styles.sectionTitle}>
               {selectedCategory === "all" ? "All Todos" : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Todos`}
             </Text>
             {loading ? (
               <View style={styles.loadingContainer}>
                 <ActivityIndicator size="large" color="#3498db" />
                 <Text style={styles.loadingText}>Loading todos...</Text>
               </View>
             ) : todos.length === 0 ? (
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
                 data={todos}
                 renderItem={renderTodo}
                 keyExtractor={(item) => item._id.toString()}
                 showsVerticalScrollIndicator={false}
                 scrollEnabled={false}
               />
             )}
           </View>
         </ScrollView>
       </KeyboardAvoidingView>

       {/* Add Todo Modal */}
       <Modal
         visible={showAddModal}
         animationType="slide"
         transparent={true}
         onRequestClose={closeAddModal}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Add New Todo</Text>
               <TouchableOpacity onPress={closeAddModal}>
                 <Ionicons name="close" size={24} color="#2c3e50" />
               </TouchableOpacity>
             </View>

             <View style={styles.modalBody}>
               <Text style={styles.inputLabel}>Todo Title</Text>
               <TextInput
                 style={styles.modalInput}
                 placeholder="Enter todo title..."
                 value={todoTitle}
                 onChangeText={setTodoTitle}
                 autoFocus={true}
               />

               <Text style={styles.inputLabel}>Category</Text>
               <View style={styles.categoryOptions}>
                 {categories.filter(cat => cat.id !== "all").map((category) => (
                   <TouchableOpacity
                     key={category.id}
                     style={[
                       styles.categoryOption,
                       todoCategory === category.id && styles.categoryOptionActive,
                     ]}
                     onPress={() => setTodoCategory(category.id)}
                   >
                     <Ionicons
                       name={category.icon}
                       size={16}
                       color={todoCategory === category.id ? "#ffffff" : category.color}
                     />
                     <Text
                       style={[
                         styles.categoryOptionText,
                         todoCategory === category.id && styles.categoryOptionTextActive,
                       ]}
                     >
                       {category.name}
                     </Text>
                   </TouchableOpacity>
                 ))}
               </View>

               <Text style={styles.inputLabel}>Priority</Text>
               <View style={styles.priorityOptions}>
                 {Object.keys(priorities).map((priority) => (
                   <TouchableOpacity
                     key={priority}
                     style={[
                       styles.priorityOption,
                       todoPriority === priority && styles.priorityOptionActive,
                       { borderColor: priorities[priority].color },
                     ]}
                     onPress={() => setTodoPriority(priority)}
                   >
                     <Text
                       style={[
                         styles.priorityOptionText,
                         todoPriority === priority && styles.priorityOptionTextActive,
                         { color: priorities[priority].color },
                       ]}
                     >
                       {priorities[priority].label}
                     </Text>
                   </TouchableOpacity>
                 ))}
               </View>
             </View>

             <View style={styles.modalFooter}>
               <TouchableOpacity
                 style={styles.cancelButton}
                 onPress={closeAddModal}
               >
                 <Text style={styles.cancelButtonText}>Cancel</Text>
               </TouchableOpacity>
                               <TouchableOpacity
                  style={[
                    styles.createButton,
                    (!todoTitle.trim() || creatingTodo) && styles.createButtonDisabled,
                  ]}
                  onPress={createTodo}
                  disabled={!todoTitle.trim() || creatingTodo}
                >
                  {creatingTodo ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.createButtonText}>Create Todo</Text>
                  )}
                </TouchableOpacity>
             </View>
           </View>
         </View>
       </Modal>
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
   loadingContainer: {
     alignItems: "center",
     paddingVertical: 40,
   },
   loadingText: {
     fontSize: 16,
     color: "#7f8c8d",
     marginTop: 16,
   },
   // Modal Styles
   modalOverlay: {
     flex: 1,
     backgroundColor: "rgba(0, 0, 0, 0.5)",
     justifyContent: "center",
     alignItems: "center",
   },
       modalContent: {
      backgroundColor: "#ffffff",
      borderRadius: 20,
      padding: 20,
      width: "90%",
      maxWidth: 400,
      height: 500,
    },
   modalHeader: {
     flexDirection: "row",
     justifyContent: "space-between",
     alignItems: "center",
     marginBottom: 20,
     paddingBottom: 15,
     borderBottomWidth: 1,
     borderBottomColor: "#ecf0f1",
   },
   modalTitle: {
     fontSize: 20,
     fontWeight: "bold",
     color: "#2c3e50",
   },
       modalBody: {
      flex: 1,
      minHeight: 300,
    },
   inputLabel: {
     fontSize: 16,
     fontWeight: "600",
     color: "#2c3e50",
     marginBottom: 8,
     marginTop: 15,
   },
   modalInput: {
     borderWidth: 1,
     borderColor: "#bdc3c7",
     borderRadius: 10,
     paddingHorizontal: 15,
     paddingVertical: 12,
     fontSize: 16,
     backgroundColor: "#f8f9fa",
   },
   categoryOptions: {
     flexDirection: "row",
     flexWrap: "wrap",
     gap: 10,
     marginBottom: 10,
   },
   categoryOption: {
     flexDirection: "row",
     alignItems: "center",
     backgroundColor: "#f8f9fa",
     paddingHorizontal: 12,
     paddingVertical: 8,
     borderRadius: 20,
     borderWidth: 1,
     borderColor: "#ecf0f1",
   },
   categoryOptionActive: {
     backgroundColor: "#3498db",
     borderColor: "#3498db",
   },
   categoryOptionText: {
     marginLeft: 6,
     fontSize: 14,
     fontWeight: "500",
     color: "#2c3e50",
   },
   categoryOptionTextActive: {
     color: "#ffffff",
   },
   priorityOptions: {
     flexDirection: "row",
     gap: 10,
     marginBottom: 10,
   },
       priorityOption: {
      flex: 1,
      borderWidth: 2,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
      backgroundColor: "#ffffff",
      marginHorizontal: 2,
    },
    priorityOptionActive: {
      backgroundColor: "#f8f9fa",
      borderWidth: 3,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
       priorityOptionText: {
      fontSize: 14,
      fontWeight: "600",
    },
    priorityOptionTextActive: {
      color: "#2c3e50",
      fontWeight: "bold",
    },
   modalFooter: {
     flexDirection: "row",
     justifyContent: "space-between",
     marginTop: 20,
     paddingTop: 15,
     borderTopWidth: 1,
     borderTopColor: "#ecf0f1",
   },
   cancelButton: {
     flex: 1,
     paddingVertical: 12,
     marginRight: 10,
     borderRadius: 10,
     borderWidth: 1,
     borderColor: "#bdc3c7",
     alignItems: "center",
   },
   cancelButtonText: {
     fontSize: 16,
     fontWeight: "600",
     color: "#7f8c8d",
   },
   createButton: {
     flex: 1,
     paddingVertical: 12,
     marginLeft: 10,
     borderRadius: 10,
     backgroundColor: "#3498db",
     alignItems: "center",
   },
   createButtonDisabled: {
     backgroundColor: "#bdc3c7",
   },
   createButtonText: {
     fontSize: 16,
     fontWeight: "600",
     color: "#ffffff",
   },
 });

export default TodoScreen;