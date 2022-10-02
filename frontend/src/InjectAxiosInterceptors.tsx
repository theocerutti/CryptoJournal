import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { setupInterceptors } from './utils/api';
import { useToast } from '@chakra-ui/react';

const InjectAxiosInterceptors = (): null => {
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    setupInterceptors(history, toast);
  }, [history, toast]);

  return null;
};

export default InjectAxiosInterceptors;
