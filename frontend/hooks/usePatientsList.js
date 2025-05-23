import { useState, useEffect } from 'react';
import { fetchPatients } from '../services/api';
import { Alert } from 'react-native';
import useDebounce from './useDebounce';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function usePatientsList() {
  const [q, setQ] = useState('');
  const debouncedQ = useDebounce(q);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(true);
  const [updateTime, setUpdateTime] = useState('')

  const PATIENT_LIST_KEY = "PATIENT_LIST_KEY"

  useEffect(_ => {
    if (!q.length) {
      setUpdateTime('') // no update time
      setData([]) // empty data set
    }
    return _ => { }
  }, [q])

  useEffect(_ => {
    try {
      if (data.length)
        // store data in local storage every time it updates
        AsyncStorage.setItem(PATIENT_LIST_KEY, JSON.stringify({
          time: new Date().toISOString(), //
          data: data
        }))
      else AsyncStorage.clear()
    } catch (error) {
      console.error(error);

    }
    return _ => { }
  }, [data])

  useEffect(_ => { // for restoring local cache
    try {
      AsyncStorage.getItem(PATIENT_LIST_KEY)
        .then(dataList => {

          if (dataList) {
            const parsedData = JSON.parse(dataList)
            setData(parsedData.data)
            setUpdateTime(parsedData.time)
          }
        })
    } catch (error) {
      console.log(error);
    }

    return _ => { }
  }, [])

  useEffect(_ => {
    // reset data for q change
    setData([])
    setNext(true)
    setPage(1)


    resyncPatientList()
    return _ => { }
  }, [debouncedQ])

  const resyncPatientList = _ => {

    if (!next || loading) return;
    else if (q.length) {
      setLoading(true);
      fetchPatients(debouncedQ, page + 1).then(res => {
        if (data.length)
          setData(d => [...d, ...res.data]);
        else setData(res.data) // no patients found for this search
        setNext(!!res.nextPage);
        setPage(p => p + 1);
        setLoading(false);
        if (res.error)
          Alert.alert("Error!", res.error)
      });
    }
  }

  return {
    searchQuery: q, setSearchQuery: setQ, data, loading, resyncPatientList, updateTime, page
  };
}
