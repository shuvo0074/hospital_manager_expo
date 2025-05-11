import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Button, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { fetchPatients } from '../services/api';
import useDebounce from '../hooks/useDebounce';
import usePatientsList from '../hooks/usePatientsList';

export default function PatientList({ navigation }) {

  const { searchQuery, setSearchQuery, data, loading, resyncPatientList, updateTime } = usePatientsList()
  const { height } = Dimensions.get('screen')

  // show text to user if there is no patient visible on screen
  const ListEmptyComponent = _ => (
    <View
      style={{
        backgroundColor: '#e3e3e3',
        height: height - 150,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text
        style={{
          textAlign: 'center'
        }}
      >
        Please search for a patient name above
      </Text>
    </View>
  )
  const LastUpdatedTime = _ => (
    <View
      style={{
        backgroundColor: '#e3e3e3',
        height: 70,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text
        style={{
          textAlign: 'center'
        }}
      >
        Last updated at: {updateTime}
      </Text>
    </View>
  )


  useEffect(() => {
    resyncPatientList()
    return _ => {
    }
  }, []);



  const loadMore = () => {
    // end reached threshold for flatlist is set to 0.2, which means if last two items are visible, the flatlist will load more data
    // Load more is being called twice for the first time because all 10 items are displayed because of large screen height and it is reaching the threshold
    resyncPatientList()
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Search patients…"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ marginBottom: 12, borderWidth: 1, padding: 8 }}
      />
      {loading && page === 1 ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={i => i.id}
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          ListHeaderComponent={updateTime?.length ? <LastUpdatedTime /> : null}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
          ListEmptyComponent={<ListEmptyComponent />}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 8 }}>
              <Text>{item.name}</Text>
              <Button
                title="Book"
                onPress={() => navigation.navigate('Book', { patient: item })}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}
