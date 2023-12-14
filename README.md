**Project Name: Payout History Application**

### Summary
This application is built using React, Typescript, and Styled Components. It includes a payout history page with server-side pagination for fetch and client-side pagination for search. The application uses custom hooks for fetching and searching data, axios for backend communication, and various React hooks such as useEffect, useCallback, and useDebounce.

### How to Run
To run the application, use the following command:
```bash
npm start
```

### Technologies Used
- React
- Typescript
- Styled Components
- Axios

### Features
- Payout history page
- Server-side pagination for fetch
- Client-side pagination for search
- Custom hooks for fetch and search data
- Use of useEffect, useCallback, and useDebounce hooks

### Getting Started
1. Clone the repository
2. Install dependencies using `npm install`
3. Run the application using `npm start`

### Additional Notes
Make sure to handle continuous events such as over-click on pagination and user input on search fields using useDebounce to prevent unnecessary actions.