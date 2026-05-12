import React, { useEffect } from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';

const DEFAULT_REDIRECT_ROUTE =
  '/servers/a246a23f-c43b-446d-a1ba-7219c53b94c6/channels/4caf111f-ed31-4e81-8735-f92d5860c878';
const OTHER_REDIRECT_ROUTE =
  '/servers/98382d04-9d6d-4b98-9dd8-9c980a4e5b0c/channels/cd9d9bbb-4202-4aa1-88ec-21c17d809301';

export default function OAuthCallbackView() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const tfaRequired = params.get('tfaRequired');
    const tfaLoginToken = params.get('tfaLoginToken');

    if (token) {
      localStorage.setItem('access_token', token);
      localStorage.removeItem('token');
      localStorage.removeItem('pending_tfa_login_token');
      window.location.replace(DEFAULT_REDIRECT_ROUTE);
      return;
    }

    if (tfaRequired === '1' && tfaLoginToken) {
      localStorage.setItem('pending_tfa_login_token', tfaLoginToken);
      window.location.replace(DEFAULT_REDIRECT_ROUTE);
      return;
    }

    window.location.replace(OTHER_REDIRECT_ROUTE);
  }, []);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="14px"
      backgroundColor="#1f2127"
      color="white"
    >
      <Spinner thickness="3px" speed="0.7s" />
      <Text>Completing sign in...</Text>
    </Box>
  );
}
