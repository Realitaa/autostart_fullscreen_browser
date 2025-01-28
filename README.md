# Autostart Fullscreen Browser

## Features

- Launches a specified web browser in fullscreen mode on the main and external monitor.
- Configurable URL to open on startup.
- Cross-platform support (Windows, macOS, Linux).

## Prerequisites

Before running the app, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 22 or higher)
- A compatible web browser (e.g., Chrome, Firefox)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Realitaa/autostart_fullscreen_browser.git
    ```
    Or download the .zip file and extract it to a directory of your choice.
2. Navigate to the project directory:
    ```sh
    cd autostart_fullscreen_browser
    ```
3. Run the following command in the project directory to install dependencies:
    ```sh
    npm init
    ```
    and
    ```sh
    npm install electron --save-dev
    ```
4. Launch the app by running the application:
    ```sh
    npm start
    ```

## Configuration

When you run the app, it also launhes the UI in minimize mode. You have the control over the app there, including the URL configuration, restart and closing the app.

## Usage

This is a development repository. For production usage, you need to build the app:
1. Install the exe builder for electron:
    ```sh
    npm install electron-packager --save-dev
    ```
2. Run the packaging:
    ```sh
    npm run package-win
    ```
3. `autostart.exe` should be in the dist directory. You can make a shortcut and copy it to the startup folder of your OS to make it run on startup.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.