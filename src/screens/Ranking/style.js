import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#00907a',
        alignItems: 'center',

    },
    trophy: {
        marginTop: -30,
        width: 250,
        height: 250,
    },
    dateText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center'
    },
    title: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    role: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ddd',
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#6c757d',
    },
    rankingContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rankingHeader: {
        width: '100%',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f8f8',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 60,
    },
    rankingList: {
        paddingBottom: 40,
    },
    rankingItem: {
        width: '100%',
        padding: 16,
        marginHorizontal: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    position: {
        width: 50,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    separator: {
        marginHorizontal: 2,
    },
    name: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    points: {
        fontSize: 16,
        width: 60,
        fontSize: 16,
        textAlign: 'right',
    },
    totalCard: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalPeso: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00907a',
    },
});
