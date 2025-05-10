import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createAppointment } from '../services/api';

export default function AppointmentForm({ route, navigation }) {
  const { patient } = route.params;
  const [doctorId, setDoctorId] = useState('');
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date(Date.now() + 3600000));

  const submit = () => {
    if (!doctorId) return Alert.alert('Doctor is required');
    if (end <= start) return Alert.alert('End must be after start');
    createAppointment({ patientId: patient.id, doctorId, start, end })
      .then(res => {
        if (res.error) Alert.alert(res.error);
        else {
          Alert.alert('Booked!');
          navigation.goBack();
        }
      });
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Patient: {patient.name}</Text>
      <TextInput
        placeholder="Doctor ID"
        value={doctorId}
        onChangeText={setDoctorId}
        style={{ borderWidth: 1, padding: 8, marginVertical: 12 }}
      />
      <Text>Start:</Text>
      <DateTimePicker
        value={start}
        mode="datetime"
        display="default"
        onChange={(_, date) => date && setStart(date)}
      />
      <Text>End:</Text>
      <DateTimePicker
        value={end}
        mode="datetime"
        display="default"
        onChange={(_, date) => date && setEnd(date)}
      />
      <Button title="Submit" onPress={submit} style={{ marginTop: 20 }} />
    </View>
)
}
