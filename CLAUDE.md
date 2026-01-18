# Claude AI Assistant Guide for CoachBoard FE

## Project Overview

CoachBoard FE is a React TypeScript frontend application for a coaching management platform. It's built with modern web technologies and follows best practices for scalability and maintainability.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v7
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router DOM v7
- **Forms**: Formik with Yup validation
- **API Client**: Axios with custom interceptors
- **Authentication**: Keycloak
- **Internationalization**: i18next
- **Styling**: Tailwind CSS + Emotion (for MUI)
- **Charts**: Recharts
- **Notifications**: SweetAlert2

## Project Structure

```
/app
  /src           - Source code
  /public        - Static assets
  package.json   - Dependencies and scripts
  vite.config.ts - Vite configuration
  tailwind.config.js - Tailwind CSS configuration
  tsconfig.json  - TypeScript configuration
```

## Common Development Tasks

### Running the Application

```bash
cd app
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Working with Features

When adding new features, consider:

1. **State Management**: Use Redux Toolkit slices for global state
2. **API Integration**: Add API calls to appropriate service files using Axios
3. **Routing**: Register new routes in the router configuration
4. **Internationalization**: Add translation keys to i18n files
5. **Forms**: Use Formik + Yup for form handling and validation
6. **UI Components**: Use MUI components with Tailwind utility classes

### Code Style Guidelines

- Follow the existing ESLint configuration
- Use TypeScript for type safety
- Prefer functional components with hooks
- Use Redux Toolkit's `createSlice` for state management
- Keep components focused and single-purpose
- Use proper TypeScript types instead of `any`

## Authentication Flow

The application uses Keycloak for authentication. The auth flow includes:
- SSO silent check (`silent-check-sso.html`)
- Token management with Redux
- Protected routes using authentication guards

## Internationalization

- Supports multiple languages with URL parameter (`?lang=`) and localStorage sync
- Falls back to English if unsupported language is selected
- Translation files should be updated when adding new UI text

## Key Patterns to Follow

### Redux Slices
```typescript
// Use Redux Toolkit's createSlice
const slice = createSlice({
  name: 'feature',
  initialState,
  reducers: { ... }
});
```

### API Calls
```typescript
// Use the configured Axios instance with interceptors
import apiClient from './apiClient';
const response = await apiClient.get('/endpoint');
```

### Form Validation
```typescript
// Use Yup schemas with Formik
const schema = yup.object().shape({ ... });
```

## When Working with Claude

### Best Practices

1. **Read Before Modifying**: Always read existing files before making changes
2. **Maintain Consistency**: Follow existing patterns in the codebase
3. **Type Safety**: Ensure proper TypeScript typing
4. **Test Integration**: Consider how changes affect existing features
5. **i18n Compliance**: Add translations for any user-facing text

### Useful Context to Provide

- Specific feature you're working on
- Related components or services
- Any error messages you're encountering
- Whether you need new routes, state, or API endpoints

### Common Requests

- "Add a new feature for [functionality]"
- "Fix the TypeScript error in [file]"
- "Update the API integration for [endpoint]"
- "Add translation support for [feature]"
- "Create a new Redux slice for [feature]"
- "Add form validation for [form]"

## Important Files

- `/app/src/store` - Redux store configuration and slices
- `/app/src/routes` - Routing configuration
- `/app/i18n.ts` - Internationalization setup
- `/app/vite.config.ts` - Build configuration
- `/app/tailwind.config.js` - Tailwind styling configuration

## Version Management

The project includes a version bumping script (`version-bump.js`) for managing application versions.

## Docker Support

The application includes Docker configuration:
- `Dockerfile` in `/app` directory
- `docker-compose.yml` in root directory
- Nginx configuration for production deployment

## Collaborators

- Shahmar Kazimov ([@ShahmarKazimov](https://github.com/ShahmarKazimov))
- Aygun Aghalarova ([@Aygunea](https://github.com/Aygunea))
- Tahir Tahirli ([@Tahirli](https://github.com/TAHiRLI))

## Getting Help

When working with Claude on this project:
1. Provide specific context about what you're trying to accomplish
2. Share relevant error messages or issues
3. Mention which part of the application you're working on
4. Ask for explanations of existing patterns if unclear

Claude can help with:
- Feature implementation
- Bug fixes
- Code refactoring
- TypeScript type issues
- Redux state management
- API integration
- Form validation
- Routing configuration
- Internationalization
- UI component development
- Testing strategies

---

**Last Updated**: 2026-01-18
