# How to Create .env File

## Quick Setup

1. Create a file named `.env` in the `backend` folder
2. Copy the following content into it:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bhojan-setu
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

## Environment Variables Explained

### PORT
- The port number your server will run on
- Default: `5000`
- Example: Your API will be available at `http://localhost:5000`

### NODE_ENV
- Environment mode: `development` or `production`
- Use `development` for local development
- Use `production` for deployed server

### MONGODB_URI

#### For Local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/bhojan-setu
```
- Make sure MongoDB is installed and running locally
- Default MongoDB port is `27017`
- `bhojan-setu` is the database name (you can change it)

#### For MongoDB Atlas (Cloud):
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `bhojan-setu` (or your preferred name)

Example:
```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/bhojan-setu?retryWrites=true&w=majority
```

### JWT_SECRET
- A secret key used to sign and verify JWT tokens
- **IMPORTANT**: Use a strong, random string
- **NEVER** commit this to version control
- Generate a secure secret:

#### Option 1: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Option 2: Using Online Generator
Visit: https://randomkeygen.com/ and use a "CodeIgniter Encryption Keys"

#### Option 3: Use a long random string
Example:
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### JWT_EXPIRE
- How long JWT tokens remain valid
- Default: `7d` (7 days)
- Other options: `1h`, `24h`, `30d`, etc.

## Complete .env File Example

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB - Local
MONGODB_URI=mongodb://localhost:27017/bhojan-setu

# OR MongoDB - Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bhojan-setu?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=my-super-secret-jwt-key-1234567890-abcdefghijklmnopqrstuvwxyz
JWT_EXPIRE=7d
```

## Important Notes

1. **Never commit `.env` to Git** - It's already in `.gitignore`
2. **Keep JWT_SECRET secret** - Don't share it publicly
3. **Use different values for development and production**
4. **Make sure MongoDB is running** before starting the server

## Testing Your Configuration

After creating the `.env` file, test it:

```bash
cd backend
npm start
```

If everything is configured correctly, you should see:
```
MongoDB Connected: localhost:27017
Server is running on port 5000
Environment: development
API Base URL: http://localhost:5000/api
```


