import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Button, ActivityIndicator } from 'react-native';
import { fetchPatients } from '../services/api';
import useDebounce from '../hooks/useDebounce';

export default function PatientList({ navigation }) {
  const [q, setQ] = useState('');
  const debouncedQ = useDebounce(q);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPatients(debouncedQ, 1).then(res => {
      setData(res.data);
      setNext(!!res.nextPage);
      setPage(1);
      setLoading(false);
    });
  }, [debouncedQ]);

  const loadMore = () => {
    if (!next || loading) return;
    setLoading(true);
    fetchPatients(debouncedQ, page + 1).then(res => {
      setData(d => [...d, ...res.data]);
      setNext(!!res.nextPage);
      setPage(p => p + 1);
      setLoading(false);
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
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
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
