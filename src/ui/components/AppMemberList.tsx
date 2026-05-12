import { Box } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { Text } from '@chakra-ui/layout';
import AppMemberGroup from './AppMemberGroup';
import AppMemberListItem from './AppMemberListItem';
import { fetchCurrentUser } from '../../app/services/user.service';

export default function AppMemberList() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const currentUser = await fetchCurrentUser();
        if (isMounted) {
          setUsers(currentUser ? [currentUser] : []);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        if (isMounted) {
          setErrorMessage('Unable to load member list.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box
      paddingTop="15px"
      flexGrow={1}
      height="0px"
      display="flex"
      overflowY="hidden"
      flexDirection="column"
      paddingX="5px"
      _hover={{
        overflowY: 'scroll',
      }}
    >
      {isLoading ? (
        <Text color="whiteAlpha.600" fontSize="sm" marginBottom="12px">
          Loading members...
        </Text>
      ) : null}

      {errorMessage ? (
        <Text color="red.300" fontSize="sm" marginBottom="12px">
          {errorMessage}
        </Text>
      ) : null}

      {users.length ? (
        <Box marginBottom="25px">
          <Text color="gray.400" fontSize="xs" fontWeight="bold">
            MEMBERS - {users.length}
          </Text>

          {users.slice(0, 20).map((user) => (
            <AppMemberListItem
              key={user.id}
              name={user.name ?? user.email ?? 'unknown'}
            />
          ))}
        </Box>
      ) : (
        <>
          <AppMemberGroup label="Novice" />
          <AppMemberGroup label="Angular Team Member" />
          <AppMemberGroup label="Google Developer Expert" />
          <AppMemberGroup label="Flutter Team Member" />
        </>
      )}
    </Box>
  );
}
