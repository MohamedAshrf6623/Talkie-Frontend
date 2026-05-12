import {
  ChevronDownIcon,
  InfoOutlineIcon,
  RepeatIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Center,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { getChatSocket, supabase } from '../../app/supabase';
import { useAuth } from '../../hooks/useAuth';
import { OTHER_REDIRECT_ROUTE } from '../../routes/defaultRoute';
import { colors } from '../theme/colors';
import AppCategoryList from './AppCategoryList';
import AppIconButton from './AppIconButton';
import { logoutApi } from '../../app/services/auth-api.service';
import talkieLogo from '../../logo.svg';

function useBrandLogo(defaultSvg: string) {
  // Prefer the raster logo placed in public at runtime.
  return '/talkie-logo.png';
}

function LogoAvatar(props: { size?: any }) {
  const logo = useBrandLogo(talkieLogo);
  return <Avatar src={logo} name="Talkie" {...props} />;
}

export default function AppLeftSidebar() {
  return (
    <Box
      width="300px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      backgroundColor={colors.grayMedium}
    >
      <AppLeftSidebarTopbar />

      <AppCategoryList />

      <BottomSection />
    </Box>
  );
}

function AppLeftSidebarTopbar() {
  const history = useHistory();

  return (
    <Box
      height="50px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      paddingX="5px"
      backgroundColor={colors.grayMedium}
      borderBottomColor="gray"
      borderBottomWidth="1px"
    >
      <Menu>
        <MenuButton
          as={Button}
          color="white"
          width="full"
          backgroundColor="transparent"
          rightIcon={<ChevronDownIcon />}
          _hover={{ background: 'none' }}
          _active={{ background: 'none' }}
        >
          <HStack maxW="225px" spacing="8px">
            <LogoAvatar size="xs" />
            <Text isTruncated>Talkie</Text>
          </HStack>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => history.push('/login')}>Sign In</MenuItem>
          <MenuItem onClick={() => history.push('/login?mode=signup')}>
            Sign Up
          </MenuItem>
          <MenuItem
            onClick={async () => {
              await supabase.auth.signOut();
              history.replace('/login');
              window.location.reload();
            }}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}

function BottomSection() {
  const user = useAuth();
  const history = useHistory();
  const [presenceStatus, setPresenceStatus] = useState<
    'online' | 'dnd' | 'idle' | 'offline'
  >('online');

  function toSettingsView() {
    history.push('/settings');
  }

  function toOther() {
    history.push(OTHER_REDIRECT_ROUTE);
  }

  async function logout() {
    await logoutApi().catch((err) => console.log('Logout cleanup:', err));

    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    history.replace('/login');
    window.location.reload();
  }

  function setPresence(status: 'online' | 'dnd' | 'idle' | 'offline') {
    setPresenceStatus(status);

    const socket = getChatSocket();
    if (socket) {
      socket.emit('presence:set', { status });
    }
  }

  const statusColors: Record<string, string> = {
    online: '#43b581',
    dnd: '#f04747',
    idle: '#faa61a',
    offline: '#747f8d',
  };

  const statusEmoji: Record<string, string> = {
    online: '🟢',
    dnd: '🔴',
    idle: '🟡',
    offline: '⚫',
  };

  return (
    <Box
      paddingY="12px"
      paddingX="5px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor={colors.grayDark}
    >
      <Center>
        <LogoAvatar size="sm" />
      </Center>
      <Box marginX="10px">
        <Text color="white" maxW="100px" fontSize="sm" isTruncated>
          {user?.email ?? 'Guest'}
        </Text>

        <Text color="gray.500" fontSize="xs">
          {statusEmoji[presenceStatus]} {presenceStatus}
        </Text>
      </Box>
      <HStack>
        <AppIconButton
          ariaLabel="Mute mic"
          icon={<InfoOutlineIcon />}
        ></AppIconButton>
        <AppIconButton
          ariaLabel="To other"
          tooltip="Other"
          icon={<RepeatIcon />}
          onClick={toOther}
        ></AppIconButton>
        <AppIconButton
          ariaLabel="Settings"
          tooltip="Settings"
          icon={<SettingsIcon />}
          onClick={toSettingsView}
        ></AppIconButton>
        <Menu>
          <MenuButton
            as={Button}
            backgroundColor="transparent"
            color="white"
            padding="0"
            minWidth="auto"
            height="auto"
            _hover={{ background: 'none' }}
            _active={{ background: 'none' }}
          >
            <ChevronDownIcon />
          </MenuButton>
          <MenuList bg={colors.darkMedium} border="none">
            <MenuItem
              bg={colors.darkMedium}
              _hover={{ bg: 'gray.600' }}
              onClick={() => setPresence('online')}
            >
              🟢 Online
            </MenuItem>
            <MenuItem
              bg={colors.darkMedium}
              _hover={{ bg: 'gray.600' }}
              onClick={() => setPresence('dnd')}
            >
              🔴 Do Not Disturb
            </MenuItem>
            <MenuItem
              bg={colors.darkMedium}
              _hover={{ bg: 'gray.600' }}
              onClick={() => setPresence('idle')}
            >
              🟡 Away
            </MenuItem>
            <MenuItem
              bg={colors.darkMedium}
              _hover={{ bg: 'gray.600' }}
              onClick={() => setPresence('offline')}
            >
              ⚫ Offline
            </MenuItem>
            <MenuItem
              bg={colors.darkMedium}
              _hover={{ bg: 'gray.600' }}
              onClick={logout}
              color="red.300"
            >
              🚪 Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Box>
  );
}
