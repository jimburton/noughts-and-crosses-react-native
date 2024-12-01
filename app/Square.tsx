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
        borderWidth: 2,
        borderColor: 'black',
        elevation: 3,
        backgroundColor: 'white',
    },
    text: {
        fontSize: 30,
        fontFamily: 'monospace',
        lineHeight: 30,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
    },
});