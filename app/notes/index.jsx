import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AddNoteModal from "../components/AddNoteModal";
import NoteList from "../components/NoteList";

const NoteScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [newNote, setNewNote] = useState("");

    const [notes, setNotes] = useState([
        { id: 1, text: "Note 1" },
        { id: 2, text: "Note 2" },
        { id: 3, text: "Note 3" },
    ]);

    const handleAddNote = () => {
        if (newNote.trim()) {
            const newNoteObj = {
                id: Date.now(),
                text: newNote.trim()
            };
            setNotes([...notes, newNoteObj]);
            setNewNote("");
            setModalVisible(false);
        }
    };

  return (
    <View style={styles.container}>
      {/* Note List */}
      <NoteList notes={notes} />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Note</Text>
      </TouchableOpacity>

      {/* Modal */}
      <AddNoteModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newNote={newNote}
        setNewNote={setNewNote}
        handleAddNote={handleAddNote}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 80,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#ff8c00",
    padding: 15,
    borderRadius: 8,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NoteScreen;