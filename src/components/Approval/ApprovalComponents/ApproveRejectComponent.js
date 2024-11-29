import React from 'react';
import { View, Button, ToastAndroid, StyleSheet } from 'react-native';
import axios from 'axios';

const ApproveRejectComponent = ({ approveUrl, rejectUrl, params }) => {

    const handleAction = async (action) => {
        const url = action === 'approve' ? approveUrl : rejectUrl;
        const successMessage = action === 'approve' ? 'Approve Successfully' : 'Reject Successfully';
        const errorMessage = action === 'approve' ? 'Approval Failed' : 'Rejection Failed';

        try {
            const response = await axios.post(url, params);

            if (response.status === 200) {
                ToastAndroid.show(successMessage, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
            }
        } catch (error) {
            ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        }
    };

    return (
        <View style={styles.container}>
            <Button
                title="Approve"
                onPress={() => handleAction('approve')}
                color="green"
            />
            <Button
                title="Reject"
                onPress={() => handleAction('reject')}
                color="red"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 20,
    },
});

export default ApproveRejectComponent;
