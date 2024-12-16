# Auto-Nav-App

React Native app for Bluetooth-controlled Arduino car with manual & autonomous modes, 4-directional control, and custom waypoint mapping.

## Features

- Manual and autonomous driving modes
- 4-directional control
- Custom waypoint mapping

[//]: # (- Real-time vehicle status display &#40;battery, obstacle distance, speed&#41;)

[//]: # (- Car location display with refresh functionality)

## Technologies Used

- React Native
- TypeScript
- JavaScript
- Bluetooth communication with Arduino

## Prerequisites

- Node.js
- npm
- Android Studio (for Android development)
- React Native CLI

## Steps to Run the Project

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd Auto-Nav-App
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

## Environment Variables

1. Create a `.env` file in the root directory of your project.
2. Add your environment variables to the `.env` file in the format `KEY=VALUE`.

Example `.env` file:
```.env
SERVICE_UUID=your-service-uuid-here
CHARACTERISTIC_UUID=your-characteristic-uuid-here
```

### Android

1. Ensure you have an `android` folder in your project path. If not, run:
    ```sh
    npm run android
    ```

2. Start the app:
    ```sh
    npm run start
    ```

## Troubleshooting

- If you encounter an error due to the missing `android` folder, run:
    ```sh
    npm run android
    ```
  Then, start the app again:
    ```sh
    npm run start
    ```

## License

This project is licensed under the GPL-3.0 License.