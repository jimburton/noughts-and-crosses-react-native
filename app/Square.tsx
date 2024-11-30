// Square.tsx
import { StyleSheet, TouchableOpacity, Text } from "react-native";

export default function Square({value, handleClick}) {

    return  <TouchableOpacity  style={styles.square} 
                        onPress={handleClick}>
                    <Text style={styles.text}>{value}</Text>
            </TouchableOpacity>;
}

const styles = StyleSheet.create({
    square: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 40,
        borderRadius: 4,
        borderWidth: 5,
        borderColor: 'black',
        elevation: 3,
        backgroundColor: 'gray',
    },
    text: {
        fontSize: 16,
        fontFamily: 'monospace',
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
    },
});