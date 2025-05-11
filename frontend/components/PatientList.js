import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Button, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { fetchPatients } from '../services/api';
import useDebounce from '../hooks/useDebounce';

export default function PatientList({ navigation }) {
  const [q, setQ] = useState('');
  const debouncedQ = useDebounce(q);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(true);
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


  useEffect(() => {
    if (q.length) { // if search query is not empty
      setLoading(true);
      fetchPatients(debouncedQ, 1).then(res => {
        setData(res.data);
        setNext(!!res.nextPage);
        setPage(1);
        setLoading(false);
        if (res.error)
          Alert.alert("Error!", res.error)
      });
    }
  }, [debouncedQ]);

  useEffect(_ => {
    if (!q.length)
      setData([])
  }, [q])

  const loadMore = () => {
    // end reached threshold for flatlist is set to 0.2, which means if last two items are visible, the flatlist will load more data
    // Load more is being called twice for the first time because all 10 items are displayed because of large screen height and it is reaching the threshold
    if (!next || loading || !q.length) return;
    setLoading(true);
    fetchPatients(debouncedQ, page + 1).then(res => {
      setData(d => [...d, ...res.data]);
      setNext(!!res.nextPage);
      setPage(p => p + 1);
      setLoading(false);
      if (res.error)
        Alert.alert("Error!", res.error)
    });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Search patients…"
        value={q}
        onChangeText={setQ}
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
