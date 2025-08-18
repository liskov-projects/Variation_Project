import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useFormLock = (isCompleted, redirectPath) => {
  const navigate = useNavigate();
  const isCompletedRef = useRef(isCompleted);

  useEffect(() => {
    isCompletedRef.current = isCompleted;
  }, [isCompleted]);

  useEffect(() => {
    if (!isCompleted) return;

    const handlePopState = (event) => {
      if (isCompletedRef.current) {
        event.preventDefault();
        navigate(redirectPath, { replace: true });
      }
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isCompleted, redirectPath, navigate]);

  const lockForm = (redirectTo) => {
    window.history.replaceState(null, null, window.location.pathname);
    navigate(redirectTo, { replace: true });
  };

  return { lockForm };
};

export default useFormLock;