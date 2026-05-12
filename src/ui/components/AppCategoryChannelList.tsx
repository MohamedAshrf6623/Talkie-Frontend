import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import AppChannelListItem from './AppChannelListItem';
import { fetchVisibleChannelsByServer } from '../../app/services/channel.service';
import { useAuth } from '../../hooks/useAuth';

type AppCategoryChannelListProps = {
  server?: any;
};

export default function AppCategoryChannelList({
  server,
}: AppCategoryChannelListProps) {
  const [channels, setChannels] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const user = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function loadChannels() {
      if (!server?.id || !user?.id) {
        setChannels(Array.isArray(server?.channels) ? server.channels : []);
        return;
      }

      try {
        setErrorMessage('');
        const data = await fetchVisibleChannelsByServer(server.id, user.id);

        if (isMounted) {
          setChannels(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching channels by server:', error);
        if (isMounted) {
          setErrorMessage('Unable to load channels.');
          setChannels(Array.isArray(server?.channels) ? server.channels : []);
        }
      }
    }

    void loadChannels();

    return () => {
      isMounted = false;
    };
  }, [server, user?.id]);

  const displayChannels = channels.length > 0 ? channels : [
    { id: 'ch-1', name: 'general', icon: '💬' },
    { id: 'ch-2', name: 'announcement', icon: '🎙️' },
    { id: 'ch-3', name: 'tasks', icon: '🔵' },
    { id: 'ch-4', name: 'guide', icon: '🧰' },
    { id: 'ch-5', name: 'help', icon: '🤯' },
  ];

  const serverName = server?.name || '🛫 Main';

  const handleChannelClick = (channelId: string) => {
    if (server?.id) {
      history.push(`/servers/${server.id}/channels/${channelId}`);
    }
  };

  return (
    <Box marginY="5px">
      <Text color="white" fontSize="xs" fontWeight="bold" marginBottom="5px">
        <ChevronRightIcon /> {serverName.toUpperCase()}
      </Text>
      {errorMessage ? (
        <Text color="red.300" fontSize="xs" marginBottom="6px">
          {errorMessage}
        </Text>
      ) : null}
      {displayChannels.map((channel, idx) => (
        <AppChannelListItem
          key={channel.id || idx}
          label={`${channel.icon || '💬'}-${channel.name || `channel-${idx}`}`}
          active={idx === 0}
          onClick={() => handleChannelClick(channel.id)}
        />
      ))}
    </Box>
  );
}
