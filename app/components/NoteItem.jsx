import { StyleSheet, Text, View } from "react-native";

const NoteList = ({ note }) => {
    return (
    <View style={styles.noteItem}>
        <Text style={styles.noteText}>{note?.text}</Text>
    </View>
    );
};

const styles = StyleSheet.create({
    noteItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#f5f5f5",
        padding: 15,
        borderRadius: 5,
        marginVertical: 5,
      },
      noteText: {
        fontSize: 16,
      },
});

export default NoteList;