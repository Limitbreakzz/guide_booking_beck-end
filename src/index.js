require('dotenv').config();
const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const guideRoute = require('./routes/guide.route')
const touristRoute = require('./routes/tourist.route')
const provinceRoute = require('./routes/province.route')
const tripRoute = require('./routes/trip.route')
const bookingRoute = require('./routes/booking.route')
const authRoutes = require('./routes/auth.route')
const adminRoutes = require('./routes/admin.route')
const contactRoutes = require('./routes/contact.routes');


app.use('/images', express.static(path.join(__dirname, '../images')));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/guides', guideRoute);
app.use('/tourists', touristRoute);
app.use('/provinces', provinceRoute);
app.use('/trips', tripRoute);
app.use('/bookings', bookingRoute);
app.use('/contact', contactRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Guide Booking API',
    endpoints: {
      documentation: `${import.meta.env.VITE_API_URL}:${PORT}/api-docs`
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on :${import.meta.env.VITE_API_URL}:${PORT}`);
  console.log(`API Docs: ${import.meta.env.VITE_API_URL}:${PORT}/api-docs`);
});