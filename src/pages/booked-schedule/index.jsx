import React from 'react';
import { useGlobalContext } from '../../contexts/GlobalContext';
import OwnerBookScheduled from '../../components/owner-book-scheduled';
import UserBookScheduled from '../../components/user-book-scheduled';

const BookSchedule = () => {
  const { user } = useGlobalContext();
  console.log(user);

  return (
    <>
      {user.role === '0' && <UserBookScheduled />}
      {user.role === '1' && <OwnerBookScheduled />}
    </>
  );
};

export default BookSchedule;
