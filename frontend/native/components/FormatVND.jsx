import React from 'react';
import { Text } from 'react-native';

const formatVND = (value) => {
    if (typeof value !== 'number') value = Number(value);
    if (isNaN(value)) return value;
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const FormatVND = ({ value, style }) => (
    <Text style={style}>{formatVND(value)} ₫</Text>
);

export default FormatVND;
