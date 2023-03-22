import {useRef, useEffect} from 'react';
import {EventRegister} from 'react-native-event-listeners';

export const useEventEmitter = (name, callback) => {
  const refPlayEvent = useRef(null);

  useEffect(() => {
    if (refPlayEvent?.current !== null) {
      EventRegister.removeEventListener(refPlayEvent.current);
      refPlayEvent.current = null;
    }
    refPlayEvent.current = EventRegister.addEventListener(name, callback);

    return () => {
      if (refPlayEvent?.current !== null) {
        EventRegister.removeEventListener(refPlayEvent.current);
        refPlayEvent.current = null;
      }
    };
  }, []);
};
