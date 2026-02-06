const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  ASK_QUESTION: "/ask-question",
  PROFILE: (id: number) => `/profile/${id}`,
  TAGS: (id: number) => `/tags/${id}`,
  QUESTION: (id: number) => `/question/${id}`,
};

export default ROUTES;
