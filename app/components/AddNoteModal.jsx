import { useEffect, useRef } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const AddNoteModal = ({ modalVisible, setModalVisible, newNote, setNewNote, handleAddNote }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (modalVisible) {
            // Auto focus the input when modal opens
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [modalVisible]);
    return (
        <Modal 
        visible={modalVisible} 
        animationType="slide" 
        transparent
        onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add a new note</Text>
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        placeholder="Enter your note"
                        value={newNote}
                        onChangeText={setNewNote}
                        placeholderTextColor="#aaa"
                        multiline
                        autoFocus={true}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity 
                            style={styles.cancelButton} 
                            onPress={() => {
                                setNewNote("");
                                setModalVisible(false);
                            }}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.saveButton} 
                            onPress={handleAddNote}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
      </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
      },
      modalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        width: "80%",
        maxWidth: 400,
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
      },
      input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: "top",
      },
      modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
      },
      cancelButton: {
        backgroundColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
      },
      cancelButtonText: {
        color: "#333",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
      },
      saveButton: {
        backgroundColor: "#ff8c00",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
      },
      saveButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
      },
});

export default AddNoteModal;