# Pharmacy Backend API 🏥💊

![Django](https://img.shields.io/badge/Django-v4.2-092E20.svg)
![Python](https://img.shields.io/badge/Python-v3.11-3776AB.svg)
![Django REST Framework](https://img.shields.io/badge/DRF-v3.14-009688.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14-336791.svg)
![JWT](https://img.shields.io/badge/JWT-Auth-000000.svg)

## 📋 Overview

This is the backend API for the Pharmacy Management System, built with Django REST Framework. It provides a comprehensive REST API for managing pharmacy operations including prescriptions, inventory, orders, payments, and user management.

## 🏗️ Architecture

- **Framework**: Django 4.2 with Django REST Framework
- **Database**: PostgreSQL with comprehensive relational models
- **Authentication**: JWT tokens with SimpleJWT
- **API Design**: RESTful endpoints with proper serialization
- **Security**: CORS headers, environment variables, and secure configurations

## 📁 Project Structure

```
backend/
├── pharmacy/
│   ├── api/                    # Main Django app
│   │   ├── models.py          # Database models
│   │   ├── views.py           # API views
│   │   ├── serializers.py     # Data serializers
│   │   ├── urls.py            # URL patterns
│   │   └── migrations/        # Database migrations
│   ├── pharmacy/              # Django project settings
│   │   ├── settings.py        # Configuration
│   │   ├── urls.py            # Root URL patterns
│   │   └── wsgi.py            # WSGI application
│   ├── manage.py              # Django management script
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Environment variables template
│   └── db.sqlite3            # Development database (SQLite)
```

## 🚀 Quick Start

### Prerequisites

- **Python** (v3.11 or higher)
- **PostgreSQL** (v14 or higher)
- **Virtual Environment** (venv or conda)

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
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

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env` file in the backend directory:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pharmacy_db
DEBUG=True
SECRET_KEY=your-secret-key-here

# API Settings
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:19006,http://localhost:8081

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DELTA=3600
```

## 📊 Database Models

### Core Entities

- **Users**: Extended Django User model with roles (patient, doctor, pharmacist, admin)
- **Products**: Medication catalog with pricing and inventory tracking
- **Branches**: Physical pharmacy locations with inventory management
- **Prescriptions**: Medical prescriptions with approval workflow
- **Orders**: Customer orders with payment and delivery tracking
- **Inventory**: Stock management across multiple branches
- **Payments**: Transaction processing with insurance integration

### Key Relationships

- Users can have multiple roles and permissions
- Products are managed across multiple branches
- Prescriptions are linked to patients and doctors
- Orders contain multiple products with quantities
- Payments are associated with orders and payment methods

## 🛠️ Development Commands

### Database Management
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Access Django admin
python manage.py runserver
# Visit http://localhost:8000/admin
```

### Testing
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test api

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

### Data Management
```bash
# Load sample data
python manage.py loaddata fixtures/sample_data.json

# Create database backup
python manage.py dumpdata > backup.json

# Reset database
python manage.py flush
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Token refresh
- `POST /api/auth/password/reset/` - Password reset

### Products
- `GET /api/products/` - List all products
- `GET /api/products/:id/` - Get product details
- `POST /api/products/` - Create new product (Admin)
- `PUT /api/products/:id/` - Update product (Admin)
- `DELETE /api/products/:id/` - Delete product (Admin)

### Prescriptions
- `POST /api/prescriptions/` - Upload prescription
- `GET /api/prescriptions/` - List user prescriptions
- `GET /api/prescriptions/:id/` - Get prescription details
- `PUT /api/prescriptions/:id/approve/` - Approve prescription (Pharmacist)
- `DELETE /api/prescriptions/:id/` - Delete prescription

### Orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/` - List user orders
- `GET /api/orders/:id/` - Get order details
- `PUT /api/orders/:id/status/` - Update order status
- `DELETE /api/orders/:id/` - Cancel order

### Inventory
- `GET /api/inventory/` - List inventory items
- `POST /api/inventory/` - Add inventory item
- `PUT /api/inventory/:id/` - Update inventory
- `DELETE /api/inventory/:id/` - Remove inventory item

## 🧪 Testing

### Running Tests
```bash
# Run all tests
python manage.py test

# Run specific test module
python manage.py test api.tests

# Run with verbose output
python manage.py test --verbosity=2

# Run specific test class
python manage.py test api.tests.ProductTestCase
```

### Test Coverage
```bash
# Install coverage
pip install coverage

# Run tests with coverage
coverage run --source='.' manage.py test

# Generate coverage report
coverage report
coverage html  # Generates HTML report in htmlcov/
```

## 🚀 Production Deployment

### Using Gunicorn
```bash
# Install production dependencies
pip install gunicorn whitenoise

# Collect static files
python manage.py collectstatic --noinput

# Run production server
gunicorn pharmacy.wsgi:application --bind 0.0.0.0:8000
```

### Environment Variables for Production
```bash
DEBUG=False
SECRET_KEY=your-production-secret-key
DATABASE_URL=postgresql://prod_user:prod_password@prod-host:5432/prod_db
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## 📞 Support

For backend API support:
- **Email**: backend-support@pharmacy.com
- **Issues**: Create an issue in the GitHub repository
- **Documentation**: Visit `/api/docs/` when running the server for interactive API documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow PEP 8 for Python code
- Write comprehensive tests for new features
- Update API documentation
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Built with ❤️ using Django REST Framework**
