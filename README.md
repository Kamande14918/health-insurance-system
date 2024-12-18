# Health Insurance System

This project is a Health Insurance System that allows users to manage their health insurance claims, make payments, and view reports. The system is built using Node.js, Express, React, and MySQL.

## Table of Contents

- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Learn More](#learn-more)
- [License](#license)

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js
- npm
- MySQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/health-insurance-system.git
   cd health-insurance-system
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up the MySQL database:
   - Create a database named `health_insurance_system`.
   - Import the database schema from `database/schema.sql`.

4. Create a `.env` file in the root directory and add the following environment variables:
   ```properties
   JWT_SECRET=your_secret_key
   PORT=5000
   MPESA_CONSUMER_KEY=your_mpesa_consumer_key
   MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
   MPESA_SHORTCODE=your_mpesa_shortcode
   MPESA_PASSKEY=your_mpesa_passkey
   CALLBACK_URL=your_callback_url
   EMAIL=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password
   ```

5. Start the development server:
   ```bash
   npm start
   ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run eject`

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## Project Structure

```
health-insurance-system/
├── admin/
│   ├── client/
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   └── ...
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── Login.jsx
│   │   │   │   │   └── ...
│   │   │   │   ├── payments/
│   │   │   │   │   ├── MpesaPayment.jsx
│   │   │   │   │   └── ...
│   │   │   │   ├── reports/
│   │   │   │   │   ├── Reports.jsx
│   │   │   │   │   └── ...
│   │   │   │   └── ...
│   │   │   ├── App.js
│   │   │   └── ...
│   │   ├── README.md
│   │   └── ...
│   ├── server/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── ...
│   │   ├── controllers/
│   │   │   ├── reportsController.js
│   │   │   ├── subscriptionController.js
│   │   │   └── ...
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── paymentService.js
│   │   │   └── ...
│   │   ├── tasks/
│   │   │   ├── subscriptionReminder.js
│   │   │   └── ...
│   │   ├── server.js
│   │   └── ...
├── .env
├── package.json
└── ...
```

## API Endpoints

### Authentication

- `POST /api/auth/login`: Login a user.

### Admin

- `GET /api/admin/users`: Get all users.
- `POST /api/admin/users`: Create a new user.

### Reports

- `GET /api/reports/generate`: Generate a report.

### Payments

- `POST /api/mpesa/stkpush`: Initiate M-Pesa STK Push.

## Technologies Used

- **Frontend**: React, Axios
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Payment Integration**: M-Pesa
- **Email Service**: Nodemailer
- **Task Scheduling**: node-cron

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

## License

This project is licensed under the MIT License.
