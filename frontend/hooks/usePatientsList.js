import { useState, useEffect } from 'react';
import { fetchPatients } from '../services/api';
import { Alert } from 'react-native';
import useDebounce from './useDebounce';
export default function usePatientsList() {
  const [q, setQ] = useState('');
  const debouncedQ = useDebounce(q);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(true);

  useEffect(_ => {
    if (!q.length)
      setData([]) // empty data set
  }, [q])

  const resyncPatientList = _ => {
    if (!next) Alert.alert("Error!", "No more Patient");
    else if (loading) Alert.alert("Error!", "loading Patients");
    else if (!q.length) return;
    // else if (!q.length) Alert.alert("Error!", "Please search for a patient name above");
    else {
      setLoading(true);
      fetchPatients(debouncedQ, page + 1).then(res => {
        setData(d => [...d, ...res.data]);
        setNext(!!res.nextPage);
        setPage(p => p + 1);
        setLoading(false);
        if (res.error)
          Alert.alert("Error!", res.error)
      });
    }
  }

  return {
    searchQuery: q, setSearchQuery: setQ, data, loading, resyncPatientList
  };
}
