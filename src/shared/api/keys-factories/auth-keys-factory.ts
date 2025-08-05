/* eslint-disable */
/* prettier-ignore */
export const authKeys = {
  all: ['auth'],
   me: () => [...authKeys.all, 'me'],
};
