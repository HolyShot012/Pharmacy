# Pharmacy Management System 🏥💊

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-v0.79.5-61DAFB.svg)
![Django](https://img.shields.io/badge/Django-v4.2-092E20.svg)
![Python](https://img.shields.io/badge/Python-v3.11-3776AB.svg)
![Expo](https://img.shields.io/badge/Expo-v53-000020.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14-336791.svg)
![REST API](https://img.shields.io/badge/REST%20API-Django%20REST%20Framework-009688.svg)

## 📋 Overview

The Pharmacy Management System is a comprehensive digital solution designed to streamline pharmacy operations, prescription management, and patient care. This full-stack application combines a modern React Native mobile frontend with a robust Django REST API backend, providing seamless pharmacy management capabilities.

### 🎯 Key Features

- **📱 Mobile-First Design**: Cross-platform mobile application built with React Native
- **🔐 Secure Authentication**: JWT-based authentication with role-based access control
- **💊 Prescription Management**: Upload, process, and track prescription orders
- **🛒 E-commerce Integration**: Product catalog, shopping cart, and order management
- **📊 Inventory Tracking**: Real-time inventory management across multiple branches
- **💳 Payment Processing**: Multiple payment methods with insurance integration
- **📈 Analytics Dashboard**: User activity tracking and business insights
- **🔔 Push Notifications**: Real-time order updates and reminders

## 🏗️ Architecture

### Frontend - React Native (Expo)
- **Framework**: React Native with Expo
- **Navigation**: Expo Router for file-based routing
- **State Management**: React Context API for global state
- **UI Components**: Custom themed components with responsive design
- **API Integration**: Axios for REST API communication
- **Storage**: AsyncStorage for local data persistence

### Backend - Django REST API
- **Framework**: Django with Django REST Framework
- **Database**: PostgreSQL with comprehensive data models
- **Authentication**: JWT tokens with SimpleJWT
- **API Design**: RESTful endpoints with proper serialization
- **Security**: CORS headers, environment variables, and secure configurations
- **Deployment**: Production-ready with Gunicorn and WhiteNoise

## 📁 Project Structure

```
pharmacy/
├── frontend/
│   └── native/          # React Native mobile app
│       ├── app/         # Expo Router pages
│       ├── components/  # Reusable components
│       └── assets/      # Images, fonts, etc.
├── backend/
│   └── pharmacy/        # Django project
│       ├── api/         # Django app with models, views, serializers
│       ├── pharmacy/    # Django settings and configuration
│       └── manage.py    # Django management script
├── README.md
└── package.json         # Root package for frontend dependencies
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.11 or higher)
- **PostgreSQL** (v14 or higher)
- **Expo CLI** (for mobile development)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pharmacy/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Setup database**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Run development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend/native
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API endpoint**
   ```bash
   # Update API_URL in app/api.jsx with your backend URL
   ```

4. **Start development server**
   ```bash
   npm start
   # or
   expo start
   ```

## 🔧 Environment Configuration

### Backend Environment Variables (.env)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pharmacy_db
DEBUG=True
SECRET_KEY=your-secret-key

# API Settings
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:19006,http://localhost:8081

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DELTA=3600
```

### Frontend Configuration

Update `frontend/native/app/api.jsx`:

```javascript
export const API_URL = 'http://localhost:8000/api';
```

## 📊 Database Schema

The application uses a comprehensive relational database with the following key entities:

- **Users**: Patient, doctor, pharmacist, and admin accounts
- **Products**: Medication catalog with pricing and inventory
- **Branches**: Physical pharmacy locations
- **Prescriptions**: Medical prescriptions with approval workflow
- **Orders**: Customer orders with payment tracking
- **Inventory**: Stock management across branches
- **Payments**: Transaction processing with insurance support

## 🛠️ Development

### Backend Development

```bash
# Run tests
python manage.py test

# Generate migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Access Django admin
python manage.py runserver
# Visit http://localhost:8000/admin
```

### Frontend Development

```bash
# Start Metro bundler
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web

# Lint code
npm run lint
```

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test api

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

### Frontend Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)

```bash
# Install production dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Start production server
gunicorn pharmacy.wsgi:application --bind 0.0.0.0:$PORT
```

### Frontend Deployment (Expo)

```bash
# Build for production
eas build

# Submit to app stores
eas submit

# Update over-the-air
eas update
```

## 📱 Mobile App Features

### Patient Features
- 🔍 Browse medications and products
- 📸 Upload prescription images
- 🛒 Add items to cart
- 💳 Secure checkout with multiple payment options
- 📋 View order history
- 🔔 Receive order notifications
- 👤 Manage profile and medical history

### Pharmacist Features
- ✅ Review and approve prescriptions
- 📦 Manage inventory
- 📊 Track orders and deliveries
- 📈 View analytics and reports
- 🏥 Manage branch operations

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Token refresh

### Products
- `GET /api/products/` - List all products
- `GET /api/products/:id/` - Get product details
- `POST /api/products/` - Create new product (Admin)
- `PUT /api/products/:id/` - Update product (Admin)
- `DELETE /api/products/:id/` - Delete product (Admin)

### Prescriptions
- `POST /api/prescriptions/` - Upload prescription
- `GET /api/prescriptions/` - List user prescriptions
- `PUT /api/prescriptions/:id/approve/` - Approve prescription (Pharmacist)
- `DELETE /api/prescriptions/:id/` - Delete prescription

### Orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/` - List user orders
- `GET /api/orders/:id/` - Get order details
- `PUT /api/orders/:id/status/` - Update order status

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript
- Write comprehensive tests
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Team**: React Native developers
- **Backend Team**: Django/Python developers
- **Design Team**: UI/UX designers
- **QA Team**: Quality assurance engineers

## 📞 Support

For support, email [support@pharmacy.com](mailto:support@pharmacy.com) or join our Slack channel.

## 🙏 Acknowledgments

- React Native community for mobile development resources
- Django REST Framework for robust API development
- Expo team for excellent development tools
- All contributors and testers who helped improve this project

---

**Made with ❤️ by the Pharmacy Team**
