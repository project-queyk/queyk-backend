import app from "../src/app";

const port = process.env.PORT || 8080;

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}
