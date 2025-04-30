# UrbanGreen - Riyadh's Green Spaces Explorer

![React Native](https://img.shields.io/badge/React_Native-0.76.9-blue)
![Expo](https://img.shields.io/badge/Expo-52.0.46-white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![Convex](https://img.shields.io/badge/Convex-1.23.0-green)
![Clerk](https://img.shields.io/badge/Clerk-2.10.1-purple)

## Project Overview

UrbanGreen is a mobile application designed to provide users with comprehensive information about Riyadh's green spaces and related events. The app helps users discover, explore, and engage with green spaces in Riyadh, promoting environmental awareness and community participation.

## Features

- 🌳 **Green Space Discovery**: Browse and explore green spaces in Riyadh
- 📅 **Event Management**: View and participate in environmental events
- 🔐 **Secure Authentication**: User authentication via Clerk
- 🌐 **Bilingual Support**: Full English and Arabic language support
- 🌓 **Theme Support**: Light and dark mode
- 📱 **Responsive Design**: Optimized for all screen sizes
- 📍 **Location Services**: Find nearby green spaces
- 🔔 **Event Notifications**: Stay updated with upcoming events

## Technology Stack

### Frontend
- **React Native (0.76.9)**: Core framework
- **Expo (52.0.46)**: Development platform
- **TypeScript (5.3.3)**: Type safety and development experience

### Backend
- **Convex (1.23.0)**: Real-time database and backend services
- **Clerk (2.10.1)**: Authentication and user management

### Additional Tools
- **React Navigation**: Screen navigation
- **i18next**: Internationalization
- **Redux Toolkit**: State management
- **Expo Location**: Location services
- **Expo Secure Store**: Secure data storage

## Project Structure

```
src/
├── assets/        # Images, icons, fonts
├── components/    # Reusable UI components
├── config/        # App configuration
├── context/       # React Context providers
├── hooks/         # Custom React hooks
├── i18n/          # Translation files
├── models/        # Data models
├── navigation/    # Navigation setup
├── redux/         # State management
├── screens/       # Screen components
├── styles/        # Global styles
└── utils/         # Utility functions
```

## Setup and Installation

### Prerequisites
- Node.js (LTS version)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation Steps

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd urbangreen
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables
   ```bash
   # Create .env file with:
   EXPO_PUBLIC_CONVEX_URL=your_convex_url
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   ```

4. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

5. Run on specific platform
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## Key Features Implementation

### Real-time Data with Convex
- Real-time updates for events and green spaces
- Type-safe database operations
- Automatic API generation
- Seamless integration with Clerk authentication

### Authentication with Clerk
- Secure user authentication
- Social login options
- User profile management
- Session handling

### Internationalization
- Full English and Arabic support
- RTL layout support
- Dynamic language switching
- Culturally appropriate content

### Theme System
- Light and dark mode support
- Dynamic theme switching
- Persistent theme preferences
- System theme detection

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow TypeScript best practices
- Maintain consistent naming conventions
- Document complex logic

### Performance
- Implement proper memoization
- Optimize image loading
- Use virtualized lists
- Monitor bundle size

### Security
- Secure storage for sensitive data
- HTTPS for all API requests
- Input sanitization
- Proper token management

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2024 UrbanGreen. All rights reserved.
