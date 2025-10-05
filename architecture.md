# Natours - System Architecture

## Overview
A full-stack tour booking application built with Node.js, Express, MongoDB, and server-side rendering, featuring user authentication, payment processing with Stripe, interactive maps, and automated email notifications.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end

    subgraph "Presentation Layer"
        PugTemplates[Pug Templates]
        StaticAssets[Static Assets]
        MapboxGL[Mapbox GL JS]
    end

    subgraph "Application Server"
        Express[Express.js Server]
        Router[Route Handlers]
        Controllers[Controllers]
        Middleware[Middleware Stack]
    end

    subgraph "Business Logic"
        TourController[Tour Controller]
        UserController[User Controller]
        BookingController[Booking Controller]
        AuthController[Auth Controller]
        ReviewController[Review Controller]
    end

    subgraph "Data Access Layer"
        Mongoose[Mongoose ODM]
        Models[Data Models]
        Validators[Schema Validators]
    end

    subgraph "External Services"
        Stripe[Stripe Payment API]
        Mapbox[Mapbox API]
        EmailService[Email Service]
        Cloudinary[Image Storage]
    end

    subgraph "Database"
        MongoDB[(MongoDB Atlas)]
        Sessions[(Session Store)]
    end

    Browser --> Express
    Mobile --> Express
    Express --> PugTemplates
    Express --> StaticAssets
    Express --> Router

    Router --> Middleware
    Middleware --> Controllers

    Controllers --> TourController
    Controllers --> UserController
    Controllers --> BookingController
    Controllers --> AuthController
    Controllers --> ReviewController

    TourController --> Mongoose
    UserController --> Mongoose
    BookingController --> Mongoose
    ReviewController --> Mongoose

    Mongoose --> Models
    Models --> Validators
    Models --> MongoDB

    BookingController --> Stripe
    TourController --> Mapbox
    UserController --> EmailService
    TourController --> Cloudinary

    AuthController --> Sessions

    PugTemplates --> MapboxGL
    MapboxGL --> Mapbox

    style Browser fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    style Express fill:#68a063,stroke:#303030,stroke-width:3px
    style MongoDB fill:#4db33d,stroke:#13aa52,stroke-width:3px
    style Stripe fill:#635bff,stroke:#0a2540,stroke-width:2px
```

## MVC Architecture Pattern

```mermaid
graph LR
    subgraph "Views - Pug Templates"
        BaseTemplate[base.pug]
        TourList[tour-list.pug]
        TourDetail[tour-detail.pug]
        Login[login.pug]
        Account[account.pug]
        Booking[booking.pug]
    end

    subgraph "Controllers"
        ViewController[View Controller]
        TourCtrl[Tour Controller]
        UserCtrl[User Controller]
        BookingCtrl[Booking Controller]
        AuthCtrl[Auth Controller]
    end

    subgraph "Models"
        TourModel[Tour Model]
        UserModel[User Model]
        BookingModel[Booking Model]
        ReviewModel[Review Model]
    end

    subgraph "Routes"
        ViewRoutes[View Routes]
        APIRoutes[API Routes]
        UserRoutes[User Routes]
        BookingRoutes[Booking Routes]
    end

    ViewRoutes --> ViewController
    APIRoutes --> TourCtrl
    UserRoutes --> UserCtrl
    UserRoutes --> AuthCtrl
    BookingRoutes --> BookingCtrl

    ViewController --> TourModel
    TourCtrl --> TourModel
    UserCtrl --> UserModel
    BookingCtrl --> BookingModel
    AuthCtrl --> UserModel

    TourModel --> BaseTemplate
    TourModel --> TourList
    TourModel --> TourDetail
    UserModel --> Account
    BookingModel --> Booking

    style BaseTemplate fill:#ffd93d,stroke:#f59f00,stroke-width:2px
    style TourCtrl fill:#74c0fc,stroke:#1971c2,stroke-width:2px
    style TourModel fill:#b2f2bb,stroke:#2f9e44,stroke-width:2px
```

## Request/Response Flow

```mermaid
sequenceDiagram
    participant Client as Browser
    participant Router as Express Router
    participant Middleware as Middleware
    participant Controller as Controller
    participant Model as Mongoose Model
    participant DB as MongoDB
    participant View as Pug Template

    Client->>Router: GET /tours
    Router->>Middleware: Authentication check
    Middleware->>Controller: viewController.getOverview
    Controller->>Model: Tour.find()
    Model->>DB: Query tours
    DB->>Model: Return documents
    Model->>Controller: Return tour objects
    Controller->>View: Render with data
    View->>View: Compile Pug template
    View->>Client: Send HTML response

    Note over Client,View: Server-Side Rendering
```

## Booking & Payment Flow

```mermaid
sequenceDiagram
    participant User as User Browser
    participant Frontend as Client JS
    participant API as Express API
    participant Stripe as Stripe API
    participant Webhook as Stripe Webhook
    participant DB as MongoDB

    User->>Frontend: Click "Book Tour"
    Frontend->>API: POST /bookings/checkout-session
    API->>API: Verify authentication
    API->>Stripe: Create checkout session
    Stripe->>API: Return session URL
    API->>Frontend: Send checkout URL
    Frontend->>Stripe: Redirect to Stripe
    Stripe->>User: Display payment form

    User->>Stripe: Enter payment details
    Stripe->>Stripe: Process payment
    Stripe->>Webhook: POST /webhook-checkout
    Webhook->>Webhook: Verify signature
    Webhook->>DB: Create booking document
    DB->>Webhook: Confirm saved
    Webhook->>Stripe: Return 200 OK

    Stripe->>Frontend: Redirect to success page
    Frontend->>User: Display confirmation

    Note over User,DB: Secure payment processing
```

## Authentication & Authorization Flow

```mermaid
graph TB
    subgraph "Registration Flow"
        Signup[User Registration]
        HashPassword[Bcrypt Password Hash]
        CreateUser[Create User Document]
        GenerateToken[Generate JWT Token]
    end

    subgraph "Login Flow"
        Login[User Login]
        VerifyPassword[Compare Password Hash]
        IssueToken[Issue JWT Token]
        SetCookie[Set HTTP-Only Cookie]
    end

    subgraph "Protected Routes"
        Request[Incoming Request]
        ExtractToken[Extract JWT from Cookie]
        VerifyToken[Verify Token Signature]
        LoadUser[Load User from DB]
        CheckRole[Check User Role]
    end

    subgraph "Password Reset"
        ForgotPassword[Forgot Password Request]
        ResetToken[Generate Reset Token]
        SendEmail[Send Reset Email]
        ResetPassword[Reset Password with Token]
    end

    Signup --> HashPassword
    HashPassword --> CreateUser
    CreateUser --> GenerateToken

    Login --> VerifyPassword
    VerifyPassword --> IssueToken
    IssueToken --> SetCookie

    Request --> ExtractToken
    ExtractToken --> VerifyToken
    VerifyToken --> LoadUser
    LoadUser --> CheckRole

    ForgotPassword --> ResetToken
    ResetToken --> SendEmail
    SendEmail --> ResetPassword

    style Signup fill:#e3fafc,stroke:#0c8599,stroke-width:2px
    style VerifyToken fill:#fff3bf,stroke:#fab005,stroke-width:2px
    style CheckRole fill:#ffe3e3,stroke:#fa5252,stroke-width:2px
```

## Database Schema

```mermaid
erDiagram
    TOURS ||--o{ BOOKINGS : has
    TOURS ||--o{ REVIEWS : receives
    USERS ||--o{ BOOKINGS : makes
    USERS ||--o{ REVIEWS : writes
    TOURS ||--o{ START_DATES : has
    TOURS }o--|| TOUR_GUIDES : led_by

    TOURS {
        ObjectId _id PK
        string name
        number duration
        number maxGroupSize
        string difficulty
        number ratingsAverage
        number ratingsQuantity
        number price
        string summary
        string description
        string imageCover
        array images
        array startDates
        Point startLocation
        array locations
        array guides
    }

    USERS {
        ObjectId _id PK
        string name
        string email
        string password
        string passwordConfirm
        string role
        string photo
        date passwordChangedAt
        string passwordResetToken
        date passwordResetExpires
    }

    BOOKINGS {
        ObjectId _id PK
        ObjectId tour FK
        ObjectId user FK
        number price
        date createdAt
        boolean paid
    }

    REVIEWS {
        ObjectId _id PK
        string review
        number rating
        ObjectId tour FK
        ObjectId user FK
        date createdAt
    }

    START_DATES {
        date date
        number participants
        boolean soldOut
    }
```

## Middleware Pipeline

```mermaid
graph TB
    Request[Incoming Request]

    subgraph "Global Middleware"
        BodyParser[Body Parser]
        CookieParser[Cookie Parser]
        Compression[Compression]
        Helmet[Security Headers]
        RateLimiter[Rate Limiting]
        CORS[CORS Handler]
    end

    subgraph "Static Assets"
        Static[Static File Server]
    end

    subgraph "Authentication"
        Protect[Protect Middleware]
        RestrictTo[Role Restriction]
    end

    subgraph "Request Processing"
        ParamMiddleware[Param Middleware]
        ValidateBody[Body Validation]
    end

    subgraph "Routes"
        TourRoutes[Tour Routes]
        UserRoutes[User Routes]
        BookingRoutes[Booking Routes]
        ReviewRoutes[Review Routes]
        ViewRoutes[View Routes]
    end

    subgraph "Error Handling"
        ErrorController[Error Controller]
        NotFound[404 Handler]
    end

    Request --> BodyParser
    BodyParser --> CookieParser
    CookieParser --> Compression
    Compression --> Helmet
    Helmet --> RateLimiter
    RateLimiter --> CORS

    CORS --> Static
    Static --> ViewRoutes

    CORS --> Protect
    Protect --> RestrictTo
    RestrictTo --> ParamMiddleware
    ParamMiddleware --> ValidateBody

    ValidateBody --> TourRoutes
    ValidateBody --> UserRoutes
    ValidateBody --> BookingRoutes
    ValidateBody --> ReviewRoutes

    TourRoutes --> ErrorController
    UserRoutes --> ErrorController
    BookingRoutes --> ErrorController
    ReviewRoutes --> ErrorController
    ViewRoutes --> NotFound
    NotFound --> ErrorController

    style BodyParser fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style Protect fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style ErrorController fill:#ffebee,stroke:#c62828,stroke-width:2px
```

## Email Service Architecture

```mermaid
graph LR
    subgraph "Email Triggers"
        Welcome[Welcome Email]
        PasswordReset[Password Reset]
        BookingConfirm[Booking Confirmation]
    end

    subgraph "Email Service"
        EmailHandler[Email Handler]
        TemplateEngine[Email Templates]
        Mailer[Nodemailer]
    end

    subgraph "Email Providers"
        DevMailtrap[Mailtrap - Dev]
        ProdAWSSES[AWS SES - Prod]
    end

    Welcome --> EmailHandler
    PasswordReset --> EmailHandler
    BookingConfirm --> EmailHandler

    EmailHandler --> TemplateEngine
    TemplateEngine --> Mailer

    Mailer -->|Development| DevMailtrap
    Mailer -->|Production| ProdAWSSES

    style Welcome fill:#d3f9d8,stroke:#37b24d,stroke-width:2px
    style EmailHandler fill:#fff3bf,stroke:#f59f00,stroke-width:2px
    style ProdAWSSES fill:#ffe3e3,stroke:#f03e3e,stroke-width:2px
```

## Geospatial Features

```mermaid
graph TB
    subgraph "Frontend Map Display"
        MapboxComponent[Mapbox GL Component]
        TourMarkers[Tour Location Markers]
        TourRoute[Tour Route Line]
        Popup[Location Popups]
    end

    subgraph "Backend Geospatial"
        GeoJSON[GeoJSON Data]
        GeoQueries[Geospatial Queries]
        NearbyTours[Find Tours Within Radius]
        Distances[Calculate Distances]
    end

    subgraph "MongoDB Geospatial"
        GeoIndex[2dsphere Index]
        GeoOperators[Geo Operators]
    end

    MapboxComponent --> TourMarkers
    MapboxComponent --> TourRoute
    TourMarkers --> Popup

    GeoJSON --> GeoQueries
    GeoQueries --> NearbyTours
    GeoQueries --> Distances

    NearbyTours --> GeoIndex
    Distances --> GeoIndex
    GeoIndex --> GeoOperators

    GeoJSON --> MapboxComponent

    style MapboxComponent fill:#4264fb,stroke:#233876,stroke-width:2px
    style GeoJSON fill:#ffd93d,stroke:#f59f00,stroke-width:2px
    style GeoIndex fill:#b2f2bb,stroke:#2f9e44,stroke-width:2px
```

## Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **Validator**: Input validation

### Frontend
- **Pug**: Server-side templating
- **Mapbox GL JS**: Interactive maps
- **Axios**: HTTP client
- **Parcel**: Asset bundler

### External Services
- **MongoDB Atlas**: Cloud database
- **Stripe**: Payment processing
- **Mapbox**: Mapping and geocoding
- **AWS SES**: Production emails
- **Mailtrap**: Development emails
- **Cloudinary**: Image hosting

### Security
- **Helmet**: Security headers
- **Express Rate Limit**: DDoS protection
- **Express Mongo Sanitize**: NoSQL injection prevention
- **XSS Clean**: XSS attack prevention
- **HPP**: Parameter pollution prevention

## Key Features

### Tour Management
- Browse available tours
- View detailed tour information
- Interactive tour maps
- Tour reviews and ratings
- Difficulty levels and duration

### User Features
- User registration and login
- Profile management
- Photo uploads
- Password reset functionality
- Booking history

### Booking System
- Secure Stripe checkout
- Payment processing
- Booking confirmations
- Email notifications

### Reviews System
- Write tour reviews
- Rate tours (1-5 stars)
- Average rating calculation
- Review validation (one per user per tour)

## Performance Optimizations

### Database
- Compound indexes for frequent queries
- Geospatial indexes for location queries
- Aggregation pipeline for statistics
- Virtual populate for relationships
- Query middleware for common filters

### Caching
- Static asset caching
- API response caching
- CDN for images
- Browser caching headers

### Rendering
- Server-side rendering with Pug
- Asset minification
- Image optimization
- Lazy loading for images

## Security Measures

- HTTPS-only in production
- JWT stored in HTTP-only cookies
- Password encryption with bcrypt
- Rate limiting on authentication endpoints
- Input sanitization and validation
- NoSQL injection prevention
- XSS attack prevention
- CORS configuration
- Security headers with Helmet
- Content Security Policy
