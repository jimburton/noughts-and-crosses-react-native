// Square.tsx
import { StyleSheet, Button, Text } from "react-native";

export default function Square({value, handleClick}) {

    return  <Button style={styles.square} 
                title={value}
                onPress={handleClick}>
            </Button>;
}

const styles = StyleSheet.create({
    square: {
        backgroundColor: 'white',
        height: 20,
        width: 40,
        margin: 5,
        borderWidth: 2,
        borderRadius: 2,
        borderColor: 'darkslategray'
    },
});