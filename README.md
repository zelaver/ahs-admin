# Welcome to ahs admin 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
    npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## BUILD APP 
> [!IMPORTANT]  
>  https://docs.expo.dev/app-signing/managed-credentials/ read this doc to generate automatically credentials by expo server

1. run prebuild
   ```bash
    npx expo prebuild
   ```
2. get credentials from expo server
   ```bash
    eas credentials
   ```
3. aab file
   ```bash
    npx react-native build-android --mode=release
   ```
4. apk file
   ```bash
    npx expo run:android --variant release
   ```