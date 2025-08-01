# 📘 React Ts | Template

## 🚀 Overview

This project is a multilingual, responsive web application with authentication and password recovery features. It uses modern frontend tools and practices such as Tailwind CSS, Axios API client, Redux state management, and internationalization (i18n).

## 📦 Features

- Multi-language support with URL and localStorage sync  
- Authentication with cookies  
- Password recovery (Forget & Reset flow)  
- Tailwind CSS configuration  
- Axios-based API client  
- Redux for state management  

## 🧰 Technologies Used

- React  
- Redux Toolkit  
- Axios  
- Tailwind CSS  
- i18next  
- MUI (optional)

## 🔧 Key Functionalities

### Tailwind CSS Configuration

Tailwind is customized using `tailwind.config.js` for consistent styling across the application.

### API Client (Axios)

An Axios instance is created to manage HTTP requests. It includes an authentication service to handle login, logout, and token refresh.

### Internationalization (i18n)

The app supports multiple languages. Language selection is prioritized from the URL parameter (`?lang=`), followed by localStorage. If the selected language is unsupported, it defaults to English and updates the URL.

### Language Selector

A dropdown component allows users to change the language. It keeps the language state in localStorage and syncs it with the URL.

### Redux Slices

Handles login, logout, setUser, and updateToken actions. Maintains user session, loading, and error states.

### Password Recovery Flow

- **ForgetPassword**: Submits a username to receive a token.  
- **ResetPassword**: Uses the token and username from the URL to reset the password. Handles success, expired token, and password reuse cases.

## 🧪 Setup Instructions

1. **Install dependencies**: `npm install`  
2. **Start the app**: `npm run dev`  
3. **Build for production**: `npm run build`


## 🤝 Collaborators

| Name             | Profile                                    |
|------------------|--------------------------------------------|
| Shahmar Kazimov  | [@ShahmarKazimov](https://github.com/ShahmarKazimov) |
| Aygun Aghalarova | [@Aygunea](https://github.com/Aygunea)     |
| Tahir Tahirli    | [@Tahirli](https://github.com/TAHiRLI)     |