// Row.tsx
import { StyleSheet, View } from "react-native";
import Square from './Square';

/** 
 * A component which nests three Row components.
 * @author James Burton
 * 
 */
export default function Row({rowNum, squares, handleClick}) {
    const inc = rowNum*3;
    return (
    <>
    <View style={styles.row}>
        { [0,1,2].map((i) => <Square key={inc+i} value={squares[inc+i]}
                                    handleClick={() => handleClick(inc+i)} />) }
    </View>
    </>
)
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
});