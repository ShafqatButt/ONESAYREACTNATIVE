import { useRef, useState } from 'react';

import { DirectCallEndResult, DirectCallLogListQuery, SendbirdCalls } from '@sendbird/calls-react-native';

import CallHistoryManager, { CallHistory, asHistory } from '../libs/CallHistoryManager';
import { useEffectAsync } from './useEffectAsync';

export const useLocalHistory = () => {
  const [history, setHistory] = useState<CallHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffectAsync(async () => {
    setHistory(await CallHistoryManager.get());
    setLoading(false);

    return CallHistoryManager.subscribeUpdate((h) => {
      setHistory((prev) => [h, ...prev]);
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await CallHistoryManager.get();
    setHistory(data);
    setRefreshing(false);
  };

  return { history, loading, refreshing, onRefresh };
};

export const useRemoteHistory = () => {
  const [history, setHistory] = useState<CallHistory[]>([]);

  const [historyBackup, setHistoryBackup] = useState<CallHistory[]>([]);


  const [history_missed, setHistoryMissed] = useState<CallHistory[]>([]);


  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const query = useRef<DirectCallLogListQuery>();
  const missed_query = useRef<DirectCallLogListQuery>();


  useEffectAsync(async () => {
    await initQuery();

    const unsubscribes = [
      // CallHistoryManager.subscribeUpdate((history) => setHistory((prev) => [history, ...prev])),
      CallHistoryManager.subscribeUpdate((history) => { setHistory((prev) => [history, ...prev]); setHistoryBackup((prev) => [history, ...prev]); }),
      () => { query.current?.release(), missed_query.current?.release() }
    ];
    return () => unsubscribes.forEach((fn) => fn());
  }, []);

  const initQuery = async () => {
    query.current?.release();
    query.current = await SendbirdCalls.createDirectCallLogListQuery({
      endResults: [
        DirectCallEndResult.COMPLETED,
        DirectCallEndResult.CANCELED,
        DirectCallEndResult.DECLINED,
        DirectCallEndResult.DIAL_FAILED,
        DirectCallEndResult.ACCEPT_FAILED,
      ],
      limit: 20,
    });
    // setHistory((await query.current.next()).map(asHistory));

    var temp = (await query.current.next()).map(asHistory);
    setHistory(temp);
    setTimeout(() => {
      setHistoryBackup(temp);
      setLoading(false);
    }, 500);

    setHistoryMissed((await query.current.next()).map(asHistory).filter(data => data.isOutgoing == false && data.endResult != "COMPLETED"))

    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await initQuery();
    setRefreshing(false);
  };


  // const onSearchFilter = async (qstring: any) => {
  //   if (qstring != '') {
  //     setHistory(history.filter(data => data.remoteUser.metaData.phone.includes(qstring) || data.remoteUser.metaData.username.includes(qstring)))
  //   } else {
  //     await initQuery();
  //   }
  // }
  const onSearchFilter = async (qstring: any) => {
    if (qstring != '') {
      setHistory(historyBackup.filter(data => data.remoteUser.metaData.phone.includes(qstring) || data.remoteUser.nickname.includes(qstring)))
    } else {
      await initQuery();
    }
  }


  const onEndReached = async (search: any) => {
    if (query.current?.hasNext) {
      const value = await query.current.next();
      if (search == "") {
        setHistory((prev) => prev.concat(...value.map(asHistory)));
        setHistoryBackup((prev) => prev.concat(...value.map(asHistory)));
      }
    }
  };

  // const onEndReached = async () => {
  //   if (query.current?.hasNext) {
  //     const value = await query.current.next();
  //     setHistory((prev) => prev.concat(...value.map(asHistory)));
  //   }
  // };

  return { history, history_missed, loading, refreshing, onRefresh, onEndReached, onSearchFilter };
};
