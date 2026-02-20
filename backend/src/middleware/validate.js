export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const data = req[source];

      const parsed = schema.parse(data);

      req[source] = parsed; // sanitized data

      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.errors?.[0]?.message || "Invalid input",
      });
    }
  };
};
