export const supportRoutes = (version: string = 'v1') => {
  return {
    supportSendMessage: `/${version}/support/chat-create-message`,
  };
};
