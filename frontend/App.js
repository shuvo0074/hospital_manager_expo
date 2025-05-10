import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientList from './components/PatientList';
import AppointmentForm from './components/AppointmentForm';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Patients" component={PatientList} />
        <Stack.Screen name="Book" component={AppointmentForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
