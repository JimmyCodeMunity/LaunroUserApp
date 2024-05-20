import React, { useEffect, useState } from 'react';
import { Text, View,Image, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CodeLink } from '../utils';
import axios from 'axios';
import * as Icon from 'react-native-feather';

const OrderView = ({ route }) => {
    const { ordernumber } = route.params;
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [rider, setRider] = useState('');
    const [riderphone, setRiderPhone] = useState('');
    const [orderstatus, setOrderstatus] = useState('');
    const [price, setPrice] = useState('');
    const [weight, setWeight] = useState('');
    const [rating, setRating] = useState(0);

    useEffect(() => {
        getUserData();
        getOrderDetails();
    }, []);

    const getUserData = async () => {
        const user = await AsyncStorage.getItem('name');
        const phone = await AsyncStorage.getItem('phone');
        if (user) {
            setUsername(user);
            setPhone(phone);
        }
    }

    const getOrderDetails = async () => {
        try {
            const response = await axios.get(`${CodeLink}/api/v2/admin/orders/${ordernumber}`);
            const myorder = response.data;
            setRider(myorder.rider);
            setRiderPhone(myorder.riderphone);
            setOrderstatus(myorder.orderstatus);
            setPrice(myorder.price);
            setWeight(myorder.weight);
        } catch (error) {
            console.log(error)
        }
    }

    const markComplete = async () => {
        try {
            const newstatus = "Completed";
            const response = await axios.put(`${CodeLink}/api/v2/admin/updateorder/${ordernumber}`, { orderstatus: newstatus });
            const complete = response.data;
            if (complete) {
                alert('Order completed successfully');
                getOrderDetails();
            } else {
                alert('Order not completed');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleRating = (value) => {
        setRating(value);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image

                resizeMode='cover'
                className="h-60 w-full rounded-3xl contain"
                style={{ top: 0 }}
                source={require('../assets/images/laundcartoon.png')}
            />
            <View style={styles.header}>
                <Text style={styles.headerText}>Order Details</Text>
                <Text style={styles.orderNumber}>OrderNumber #{ordernumber}</Text>
            </View>

            <View style={styles.section}>
                <View style={styles.info}>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Name</Text>
                        <Text style={styles.value}>To: {username}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Phone</Text>
                        <Text style={styles.value}>To: {phone}</Text>
                    </View>
                </View>

                <View style={styles.info}>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Rider Name</Text>
                        <Text style={styles.value}>{rider}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Phone</Text>
                        <Text style={styles.value}>To: {riderphone}</Text>
                    </View>
                </View>

                <View style={styles.info}>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Total Price</Text>
                        <Text style={styles.value}>{price}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Weight</Text>
                        <Text style={styles.value}>{weight}</Text>
                    </View>
                </View>

                <View style={styles.rating}>
                    <Text style={styles.label}>Rate Rider</Text>
                    <View style={styles.stars}>
                        {[1, 2, 3, 4, 5].map((index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleRating(index)}
                                style={[styles.star, rating >= index ? styles.starFilled : null]}
                            >
                                <Icon.Star />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.status}>
                    <Text style={styles.label}>Order Status: {orderstatus}</Text>
                    {orderstatus === "Washing" && (
                        <TouchableOpacity onPress={markComplete} style={styles.completeButton}>
                            <Text style={styles.completeButtonText}>Mark Complete</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    orderNumber: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        padding: 20,
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    infoItem: {
        flex: 1,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    value: {
        fontSize: 16,
        marginTop: 5,
    },
    rating: {
        marginBottom: 20,
    },
    stars: {
        flexDirection: 'row',
    },
    star: {
        marginRight: 5,
    },
    starFilled: {
        color: 'gold',
    },
    status: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    completeButton: {
        backgroundColor: 'skyblue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    completeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default OrderView;
