export const validatePincode = async (req, res, next) => {
  try {
    const { pincode } = req.params;
    
    // Basic validation for 6 digit Indian pincode
    const isValid = /^\d{6}$/.test(pincode);
    
    if (!isValid) {
      return res.status(400).json({ message: 'Please enter a valid 6-digit Indian PIN code' });
    }

    // Mock logic to determine city by first digit
    const firstDigit = pincode.charAt(0);
    let city = 'Unknown Location';
    
    switch (firstDigit) {
      case '1': city = 'Delhi'; break;
      case '2': city = 'Lucknow'; break;
      case '3': city = 'Jaipur'; break;
      case '4': city = 'Mumbai'; break;
      case '5': city = 'Bangalore'; break;
      case '6': city = 'Chennai'; break;
      case '7': city = 'Kolkata'; break;
      case '8': city = 'Patna'; break;
      case '9': city = 'Army Post Office'; break;
      default: city = 'India';
    }

    res.json({
      valid: true,
      city,
      pincode
    });
  } catch (error) {
    next(error);
  }
};
