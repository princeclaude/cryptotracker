## Crypto Tracker App

A mobile application built with React Native and Expo that allows users to track real-time cryptocurrency prices and manage a personal portfolio.

## Features

- Real-time market data for top cryptocurrencies
- Coin detail pages with price, image, and metadata
- Add coins with custom amounts to your portfolio
- Remove or share coins from your portfolio
- Price alerts for selected coins
- Currency conversion to multiple international currencies
- Persistent portfolio using local storage (AsyncStorage and SecureStore)
- Smooth UI with swipeable actions and toast messages
- Profile image for more personalized experience
- Face Id and Fingerprint enabled
- Key based enrollment

## Tech Stack

- React Native (with Expo)
- React Navigation
- CoinGecko API for cryptocurrency data
- AsyncStorage for local data persistence
-SecureStore for local data persistence
- Toast notifications with react-native-toast-message
- Gesture handling with react-native-gesture-handler
- Local Authentication with expo local authentication

## Folder Structure

- App.js: Entry point of the application
- PortfolioContext.js: Global context for managing the user’s portfolio
- screens/: All UI screens including Home, Coin Details, and Portfolio
- components/: Reusable UI components

## Author

Developed by Prince Kalu


## License

This project is licensed under the MIT License.