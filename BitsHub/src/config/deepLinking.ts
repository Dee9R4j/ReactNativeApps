/**
 * Deep Linking Configuration
 */
export const deepLinkingConfig = {
  prefixes: ["bitshub://", "https://bitshub.example.com"],
  config: {
    screens: {
      authentication: "login",
      private: {
        screens: {
          tabs: {
            screens: {
              "food/index": "food",
              "food/cart": "cart",
              "food/orders": "orders",
              "shows/shows": "shows",
              "wallet/wallet": "wallet",
            },
          },
          drawer: {
            screens: {
              "events/events": "events",
              merch: "merch",
              shows: "shows-drawer",
            },
          },
        },
      },
    },
  },
};
